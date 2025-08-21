// Download service skeleton (Phase 1)
import ENV from './env';
import { db, chunkPrimaryKey } from './download-db';
import {
  DownloadLifecycleState,
  DownloadRecord,
  StartDownloadParams,
  StartResult,
  DownloadId,
} from '../app/_types/downloads';
import { encryptChunk, decryptChunk } from './crypto/downloadCrypto';
import { fetchDownloadInfo, fetchDownloadProgress, fetchChunk, fetchTorrentMetadata } from '@/app/_queries/downloads';
import { StorageInfo } from '@/app/_types/downloads';

// Lightweight SHA-1 helper for ID generation (not for security)
async function sha1Id(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest('SHA-1', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function buildId(magnetLink: string, fileIndex: number) {
  return sha1Id(`${magnetLink}|${fileIndex}`);
}

export class DownloadService {
  private active = new Set<DownloadId>();
  private queue: DownloadId[] = [];
  private pollingIntervalMs = 1500;
  private running = false;

  private async storageEstimate(): Promise<StorageInfo> {
    try {
      const nav = navigator as unknown as {
        storage?: { estimate?: () => Promise<{ quota?: number; usage?: number }> };
      };
      const estFn = nav.storage?.estimate;
      if (estFn) {
        const est = await estFn();
        const quota = est.quota ?? 0;
        const usage = est.usage ?? 0;
        return { quota, usage, available: quota - usage };
      }
    } catch {
      // ignore
    }
    return { quota: 0, usage: 0, available: 0 };
  }

  private scheduleLoop() {
    if (this.running) return;
    this.running = true;
    const tick = async () => {
      try {
        // Start queued downloads if slots free
        while (this.active.size < ENV.MAX_CONCURRENT_DOWNLOADS && this.queue.length) {
          const id = this.queue.shift()!;
          this.processDownload(id).catch(() => {
            /* handled inside */
          });
        }
      } finally {
        setTimeout(tick, 800); // scheduler cadence
      }
    };
    tick();
  }

  private async enqueue(id: DownloadId) {
    if (!this.queue.includes(id) && !this.active.has(id)) {
      this.queue.push(id);
    }
    this.scheduleLoop();
  }

  private async processDownload(id: DownloadId) {
    const rec = await db.downloads.get(id);
    if (!rec || rec.lifecycle === DownloadLifecycleState.PAUSED || rec.lifecycle === DownloadLifecycleState.COMPLETED)
      return;
    this.active.add(id);
    await db.downloads.update(id, { lifecycle: DownloadLifecycleState.DOWNLOADING, updatedAt: Date.now() });
    try {
      // Fetch progress periodically while downloading (server swarm stats)
      this.pollProgress(id);
      await this.fetchMissingChunks(id);
      // Mark complete if all chunks present
      const updated = await db.downloads.get(id);
      if (updated && updated.downloadedBytes >= updated.file_size) {
        await db.downloads.update(id, {
          lifecycle: DownloadLifecycleState.COMPLETED,
          progressPercentage: 100,
          updatedAt: Date.now(),
        });
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      await db.downloads.update(id, {
        lifecycle: DownloadLifecycleState.FAILED,
        errorMessage: msg,
        updatedAt: Date.now(),
      });
    } finally {
      this.active.delete(id);
    }
  }

  private async pollProgress(id: DownloadId) {
    const loop = async () => {
      const rec = await db.downloads.get(id);
      if (!rec) return;
      if (![DownloadLifecycleState.DOWNLOADING, DownloadLifecycleState.QUEUED].includes(rec.lifecycle)) return; // stop polling
      try {
        const p = await fetchDownloadProgress(rec.magnetLink, rec.fileIndex);
        await db.downloads.update(id, {
          downloadRate: p.download_rate,
          uploadRate: p.upload_rate,
          numSeeds: p.num_seeds,
          numPeers: p.num_peers,
          progressPercentage: p.progress_percentage,
          downloadedBytes: p.downloaded_bytes,
          lastUpdated: Date.now(),
          updatedAt: Date.now(),
        });
      } catch {
        /* ignore transient */
      } finally {
        setTimeout(loop, this.pollingIntervalMs);
      }
    };
    loop();
  }

  private async fetchMissingChunks(id: DownloadId) {
    const rec = await db.downloads.get(id);
    if (!rec) return;
    const present = await db.chunks.where('downloadId').equals(id).count();
    for (let idx = present; idx < rec.total_chunks; idx++) {
      const current = await db.downloads.get(id);
      if (!current || current.lifecycle !== DownloadLifecycleState.DOWNLOADING) break;
      await this.fetchAndStoreChunk(current, idx);
    }
  }

  private async fetchAndStoreChunk(rec: DownloadRecord, chunkIndex: number) {
    const maxAttempts = 4;
    let attempt = 0;
    let raw: ArrayBuffer | null = null;
    while (attempt < maxAttempts) {
      try {
        raw = await fetchChunk(rec.magnetLink, rec.fileIndex, chunkIndex, rec.chunk_size);
        break;
      } catch (e) {
        attempt++;
        if (attempt >= maxAttempts) throw e;
        const delay = 500 * 2 ** (attempt - 1) + Math.random() * 300;
        await new Promise((r) => setTimeout(r, delay));
      }
    }
    if (!raw) throw new Error('Failed to fetch chunk');
    const { cipher, iv } = await encryptChunk(rec.magnetLink, rec.fileIndex, raw);
    const pk = chunkPrimaryKey(rec.id, chunkIndex);
    await db.chunks.put({
      id: pk,
      downloadId: rec.id,
      chunkIndex,
      size: raw.byteLength,
      data: cipher,
      createdAt: Date.now(),
      encrypted: rec.encrypted,
      iv,
    });
    const all = await db.chunks.where('downloadId').equals(rec.id).toArray();
    const downloadedBytes = all.reduce((a, c) => a + c.size, 0);
    await db.downloads.update(rec.id, {
      downloadedBytes,
      progressPercentage: (downloadedBytes / rec.file_size) * 100,
      updatedAt: Date.now(),
    });
  }

  async start(params: StartDownloadParams): Promise<StartResult> {
    const { magnetLink, fileIndex } = params;
    const id = await buildId(magnetLink, fileIndex);
    const existing = await db.downloads.get(id);
    if (existing) return { id, alreadyExisted: true };
    // Activate torrent to ensure swarm & file list ready
    await fetchTorrentMetadata(magnetLink);
    const info = await fetchDownloadInfo(magnetLink, fileIndex, params.chunkSize || ENV.DEFAULT_CHUNK_SIZE);
    if (info.file_size > ENV.MAX_DOWNLOAD_SIZE) {
      throw new Error('File exceeds max allowed size');
    }
    const storage = await this.storageEstimate();
    const required = info.file_size * 1.02; // 2% overhead
    if (storage.available && storage.available < required) {
      throw new Error('Insufficient storage quota');
    }

    const now = Date.now();
    const record: DownloadRecord = {
      id,
      magnetLink,
      fileIndex,
      lifecycle: DownloadLifecycleState.QUEUED,
      downloadedBytes: 0,
      progressPercentage: 0,
      downloadRate: 0,
      uploadRate: 0,
      numSeeds: 0,
      numPeers: 0,
      lastUpdated: now,
      createdAt: now,
      updatedAt: now,
      encrypted: ENV.DOWNLOAD_ENCRYPTION_ENABLED,
      ...info,
    };
    await db.downloads.put(record);
    await this.enqueue(id);
    return { id };
  }

  async pause(id: DownloadId) {
    await db.downloads
      .where('id')
      .equals(id)
      .modify((r: DownloadRecord) => {
        r.lifecycle = DownloadLifecycleState.PAUSED;
        r.updatedAt = Date.now();
      });
    this.active.delete(id);
  }

  async resume(id: DownloadId) {
    const rec = await db.downloads.get(id);
    if (!rec) return;
    if (rec.lifecycle === DownloadLifecycleState.COMPLETED) return;
    await db.downloads.update(id, { lifecycle: DownloadLifecycleState.QUEUED, updatedAt: Date.now() });
    await this.enqueue(id);
  }

  async cancel(id: DownloadId) {
    // remove record + chunks
    await db.chunks.where('downloadId').equals(id).delete();
    await db.downloads.delete(id);
    this.active.delete(id);
  }

  async getRecord(id: DownloadId) {
    return db.downloads.get(id);
  }

  async list() {
    return db.downloads.toArray();
  }

  async getBlob(id: DownloadId): Promise<Blob> {
    const rec = await db.downloads.get(id);
    if (!rec) throw new Error('Not found');
    const chunks = await db.chunks.where('downloadId').equals(id).sortBy('chunkIndex');
    const parts: BlobPart[] = [];
    for (const c of chunks) {
      let data: Blob | ArrayBuffer = c.data;
      if (rec.encrypted && c.iv) {
        const ab = c.data instanceof Blob ? await c.data.arrayBuffer() : c.data;
        const plain = await decryptChunk(rec.magnetLink, rec.fileIndex, ab, c.iv as Uint8Array);
        data = new Blob([plain]);
      }
      parts.push(data instanceof Blob ? data : new Blob([data]));
    }
    return new Blob(parts, { type: rec.mime_type });
  }
}

export const downloadService = new DownloadService();
