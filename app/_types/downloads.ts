// Download domain types derived from OpenAPI torrent endpoints
// Phase 1: foundational type definitions

export type DownloadId = string; // format: sha1(magnetLink)+":"+fileIndex

export interface DownloadInfo {
  total_chunks: number;
  chunk_size: number;
  file_size: number;
  last_chunk_size: number;
  file_name: string;
  mime_type: string;
}

export interface DownloadProgress {
  file_index: number;
  file_size: number;
  downloaded_bytes: number;
  progress_percentage: number;
  download_rate: number; // bytes/sec
  upload_rate: number; // bytes/sec
  num_seeds: number;
  num_peers: number;
  state: string; // raw server state
  total_pieces: number;
  downloaded_pieces: number;
}

export enum DownloadLifecycleState {
  QUEUED = 'queued',
  INITIALIZING = 'initializing',
  DOWNLOADING = 'downloading',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  VERIFYING = 'verifying',
  STALLED = 'stalled',
  INSUFFICIENT_SPACE = 'insufficient_space',
}

export interface DownloadRecord extends DownloadInfo {
  id: DownloadId;
  magnetLink: string;
  fileIndex: number;
  lifecycle: DownloadLifecycleState;
  downloadedBytes: number;
  progressPercentage: number; // mirror server or local computed
  downloadRate: number; // smoothed bytes/sec
  uploadRate: number;
  numSeeds: number;
  numPeers: number;
  lastUpdated: number; // epoch ms
  createdAt: number;
  updatedAt: number;
  errorMessage?: string;
  encrypted: boolean;
}

export interface StorageInfo {
  quota: number; // bytes
  usage: number; // bytes
  available: number; // quota - usage
  required?: number; // bytes needed for new download
  sufficient?: boolean;
}

export interface StartDownloadParams {
  magnetLink: string;
  fileIndex: number;
  chunkSize?: number;
}

// Torrent metadata activation
export interface TorrentFileEntry {
  index: number;
  path: string;
  name: string;
  size_bytes: number;
  size_mb: number;
  is_video: boolean;
  mime_type: string;
}

export interface TorrentMetadataResponse {
  torrent_name: string;
  total_files: number;
  files: TorrentFileEntry[];
  preloaded_file_index?: number | null;
}

export interface DownloadChunkMeta {
  downloadId: DownloadId;
  chunkIndex: number;
  size: number;
  createdAt: number;
  encrypted: boolean;
  iv?: Uint8Array; // if encrypted
}

export interface QueueItem {
  id: DownloadId;
  priority: number;
  createdAt: number;
}

export interface StartResult {
  id: DownloadId;
  alreadyExisted?: boolean;
}

export interface DownloadServiceAPI {
  start(params: StartDownloadParams): Promise<StartResult>;
  pause(id: DownloadId): Promise<void>;
  resume(id: DownloadId): Promise<void>;
  cancel(id: DownloadId): Promise<void>; // remove + chunks
  getRecord(id: DownloadId): Promise<DownloadRecord | undefined>;
  getBlob(id: DownloadId): Promise<Blob>;
  list(): Promise<DownloadRecord[]>;
}
