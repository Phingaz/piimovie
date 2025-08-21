// Dexie database setup for downloads (Phase 1)
// Dexie imported dynamically to avoid type resolution issues before installation
import Dexie, { Table } from 'dexie';
import { DownloadRecord, DownloadId, DownloadChunkMeta } from '../app/_types/downloads';

export interface ChunkRow extends DownloadChunkMeta {
  // Store either a Blob or ArrayBuffer (possibly encrypted data)
  data: Blob | ArrayBuffer;
  id?: string; // primary key composed externally
}

export class DownloadDB extends Dexie {
  downloads!: Table<DownloadRecord, string>; // id
  chunks!: Table<ChunkRow, string>; // primary key id
  meta!: Table<{ key: string; value: unknown }, string>;

  constructor() {
    super('DownloadDB');
    this.version(1).stores({
      downloads: '&id, lifecycle, magnetLink, fileIndex',
      chunks: '&id, downloadId, downloadId_chunkIndex',
      meta: '&key',
    });
  }
}

export const db = new DownloadDB();

// Helper key builders
export const chunkPrimaryKey = (downloadId: DownloadId, chunkIndex: number) => `${downloadId}::${chunkIndex}`;
