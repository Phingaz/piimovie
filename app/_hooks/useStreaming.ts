import { useState, useCallback } from 'react';
import { StreamingState } from '@/app/_types/streaming';
import { fetchStreamingFiles } from '@/app/_queries/streaming';
import { toast } from 'sonner';
import useLocalStorage from './useLocalStorage';

export const useStreaming = () => {
  const [state, setState] = useState<StreamingState>({
    files: [],
    loading: false,
    isStreaming: false,
  });
  const [magnetLink] = useLocalStorage<string>('magnetLink', '');
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);
  const selectedFile = selectedFileIndex >= 0 ? state.files[selectedFileIndex] : null;

  const fetchFiles = useCallback(async (magnetLink: string, timeout: number = 60) => {
    if (!magnetLink) {
      setState((prev) => ({ ...prev, error: 'Please provide a magnet link' }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetchStreamingFiles(magnetLink, timeout);
      setState((prev) => ({ ...prev, files: response.files }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to fetch files',
      }));
      toast.error(error instanceof Error ? error.message : 'Failed to fetch files');
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  const startStreaming = useCallback(
    (fileIndex?: number) => {
      const indexToUse = fileIndex !== undefined ? fileIndex : selectedFileIndex;
      if (indexToUse >= 0 && indexToUse < state.files.length) {
        setSelectedFileIndex(indexToUse);
        setState((prev) => ({ ...prev, isStreaming: true, error: null }));
      }
    },
    [selectedFileIndex, state.files.length],
  );

  const stopStreaming = useCallback(() => {
    setSelectedFileIndex(-1);
    setState((prev) => ({ ...prev, isStreaming: false }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  return {
    ...state,
    magnetLink,
    selectedFile,
    selectedFileIndex,
    setSelectedFileIndex,
    fetchFiles,
    startStreaming,
    stopStreaming,
    setError,
  };
};
