'use client';

import React from 'react';
import { StreamingFile } from '@/app/_types/streaming';
import { cn } from '@/lib/utils';
import { FileIcon, PlayCircleIcon, StopCircleIcon } from 'lucide-react';
import { toast } from 'sonner';

interface FileListProps {
  files: StreamingFile[];
  loading: boolean;
  isStreaming: boolean;
  startStreaming: (fileIndex?: number) => void;
  stopStreaming: () => void;
  magnetLink: string;
  selectedFileIndex: number;
}

const FileList = ({
  files,
  loading,
  isStreaming,
  startStreaming,
  stopStreaming,
  magnetLink,
  selectedFileIndex,
}: FileListProps) => {
  if (loading) {
    return (
      <div className="animate-pulse w-full">
        <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 border border-gray-500 rounded-lg w-full px-6">
        <FileIcon size={60} strokeWidth={1} className="mx-auto mb-4 text-gray-400" />
        <p>No files available, please choose another video from the list of available download links</p>
      </div>
    );
  }

  const videoFiles = files.filter((file) => file.is_video);

  return (
    <div className="flex flex-col gap-2 flex-[3]">
      <h3 className="text-lg font-semibold text-gray-300 pl-2">Available Files</h3>

      {videoFiles.length > 0 && (
        <div className="flex flex-col gap-3 max-h-[70svh] overflow-y-auto p-2 tiny-scrollbar">
          {videoFiles.map((file) => (
            <FileItem
              file={file}
              key={file.index}
              isStreaming={isStreaming}
              stopStreaming={stopStreaming}
              startStreaming={startStreaming}
              magnetLink={magnetLink}
              selectedFileIndex={selectedFileIndex}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const FileItem = ({
  file,
  isStreaming,
  stopStreaming,
  startStreaming,
  magnetLink,
  selectedFileIndex,
}: {
  file: StreamingFile;
  isStreaming: boolean;
  stopStreaming: () => void;
  startStreaming: (fileIndex?: number) => void;
  magnetLink: string;
  selectedFileIndex: number;
}) => {
  const formatSize = (sizeMb: number): string => {
    if (sizeMb >= 1024) {
      return `${(sizeMb / 1024).toFixed(1)} GB`;
    }
    return `${sizeMb.toFixed(1)} MB`;
  };

  const handleStartStreaming = (index: number) => {
    if (!magnetLink.trim()) {
      toast.error('Please click the play button on the download list before watching a video');
      return;
    }

    startStreaming(index);
  };

  const handleStopStreaming = () => {
    stopStreaming();
  };

  return (
    <div
      className={cn(
        'bg-gray-900 rounded-sm p-3 hover:bg-gray-750 duration-200 border border-gray-900 shadow shadow-gray-500 hover:scale-[1.005] transition-all text-gray-50 relative h-full',
      )}
    >
      {selectedFileIndex === file.index && (
        <div className="flex-shrink-0 absolute right-2 bottom-2">
          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
      <div className="flex items-start space-x-3 h-full">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium truncate">{file.name}</p>
            <div className="flex flex-1"></div>
          </div>
          <div className="flex items-center shrink-0 space-x-4 text-xs text-gray-400 mb-3">
            <span>Size: {formatSize(file.size_mb)}</span>
            <span>Type: {file.mime_type}</span>
          </div>
          <div className="rounded-lg">
            {!isStreaming ? (
              <button
                onClick={() => handleStartStreaming(file.index)}
                className="px-2 py-1 flex items-center text-sm gap-2 rounded cursor-pointer bg-green-600 text-white hover:bg-green-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PlayCircleIcon size={18} /> Start Streaming
              </button>
            ) : (
              <button
                onClick={handleStopStreaming}
                className="px-2 py-1 flex items-center text-sm gap-2 rounded cursor-pointer bg-red-600 text-white hover:bg-red-700 focus:outline-none"
              >
                <StopCircleIcon size={18} /> Stop Streaming
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileList;
