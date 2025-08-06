'use client';

import React, { useCallback, useEffect } from 'react';
import { useStreaming } from '@/app/_hooks/useStreaming';
import AdvancedVideoPlayer from './AdvancedVideoPlayer';
import FileList from './FileList';
import PageSection from '../utils/texts/PageSection';
import PageTitle from '../utils/texts/PageTitle';

const StreamingComponent: React.FC = () => {
  const {
    files,
    loading,
    magnetLink,
    selectedFile,
    selectedFileIndex,
    isStreaming,
    fetchFiles,
    startStreaming,
    stopStreaming,
    setError,
  } = useStreaming();

  const handleFetchFiles = useCallback(async () => {
    await fetchFiles(magnetLink.trim());
  }, [fetchFiles, magnetLink]);

  useEffect(() => {
    if (magnetLink.trim()) {
      handleFetchFiles();
    }
  }, [handleFetchFiles, magnetLink]);

  return (
    <div className="container mx-auto mt mt-[100px] py-10 px-3 md:px-[2rem]">
      <PageSection>
        <PageTitle>Video Streaming</PageTitle>
      </PageSection>
      <div className="flex flex-col md:flex-row gap-6 mb-5 md:mb-10">
        {selectedFile?.is_video && (
          <div className="flex-[10]">
            <AdvancedVideoPlayer
              magnetLink={magnetLink}
              file={selectedFile}
              onError={(error: string) => {
                setError(error);
                stopStreaming();
              }}
            />
          </div>
        )}

        <FileList
          files={files}
          loading={loading}
          isStreaming={isStreaming}
          stopStreaming={stopStreaming}
          startStreaming={startStreaming}
          magnetLink={magnetLink}
          selectedFileIndex={selectedFileIndex}
        />
      </div>
    </div>
  );
};

export default StreamingComponent;
