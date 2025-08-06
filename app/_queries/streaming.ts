import { StreamingFilesResponse, StreamingRequest } from '@/app/_types/streaming';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '/api';

export const fetchStreamingFiles = async (
  magnetLink: string,
  timeout: number = 60,
): Promise<StreamingFilesResponse> => {
  const response = await fetch(`${API_BASE}/streaming/files`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ magnet_link: magnetLink, timeout } as StreamingRequest),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to fetch streaming files: ${response.statusText}`);
  }

  return response.json();
};

export const getStreamingUrl = (magnetLink: string, fileIndex: number): string => {
  const params = new URLSearchParams({
    magnet_link: magnetLink,
    file_index: fileIndex.toString(),
  });

  return `${API_BASE}/streaming/stream?${params}`;
};
