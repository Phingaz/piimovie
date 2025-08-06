export interface StreamingFile {
  index: number;
  name: string;
  size_mb: number;
  mime_type: string;
  is_video: boolean;
}

export interface StreamingFilesResponse {
  files: StreamingFile[];
}

export interface StreamingRequest {
  magnet_link: string;
  timeout?: number;
}

export interface StreamingPlayRequest {
  magnet_link: string;
  file_index: number;
}

export interface StreamingError {
  detail: string;
}

export interface VideoPlayerProps {
  magnetLink: string;
  fileIndex: number;
  onError?: (error: string) => void;
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
}

export interface StreamingState {
  files: StreamingFile[];
  loading: boolean;
  isStreaming: boolean;
}
