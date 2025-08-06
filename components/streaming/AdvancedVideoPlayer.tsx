'use client';

import React, { useState, useRef, useEffect } from 'react';
import { StreamingFile } from '@/app/_types/streaming';
import useLocalStorage from '@/app/_hooks/useLocalStorage';

interface AdvancedVideoPlayerProps {
  magnetLink: string;
  file: StreamingFile;
  onError?: (error: string) => void;
}

const AdvancedVideoPlayer: React.FC<AdvancedVideoPlayerProps> = ({ magnetLink, file, onError }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [startTime, setStartTime] = useLocalStorage<number | null>('startTime', null);
  const [progressBar, setProgressBar] = useLocalStorage<number>('videoProgress', 1);

  useEffect(() => {
    if (!isLoading) return;

    const duration = 300000; // 5 minutes in ms
    const start = startTime ? startTime : Date.now();
    if (!startTime) setStartTime(start);

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - start;
      const baseProgress = (elapsed / duration) * 100;

      let adjustedProgress;
      if (baseProgress <= 50) {
        adjustedProgress = baseProgress; // normal speed
      } else if (baseProgress <= 70) {
        adjustedProgress = 50 + (baseProgress - 50) * 0.8; // slower after 50%
      } else if (baseProgress <= 90) {
        adjustedProgress = 60 + (baseProgress - 70) * 0.6; // even slower after 70%
      } else {
        adjustedProgress = 66 + (baseProgress - 90) * 0.4; // very slow after 90%
      }

      const percentage = Math.min(adjustedProgress, 100);
      setProgressBar(percentage);

      if (percentage >= 100) {
        clearInterval(interval);
        setProgressBar(100);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isLoading, startTime, setStartTime, setProgressBar]);

  // Video event handlers for loading state and error
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleWaiting = () => setIsLoading(true);

    const handlePlaying = () => {
      setIsLoading(false);
      setProgressBar(1);
      setStartTime(null);
    };

    const handleError = () => {
      const msg = 'Failed to load video';
      setError(msg);
      onError?.(msg);
    };

    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('error', handleError);
    };
  }, [onError, setProgressBar, setStartTime]);

  if (error) {
    return (
      <div className="w-full aspect-video bg-black flex items-center justify-center text-white">
        <p>{error}</p>
      </div>
    );
  }

  const streamUrl = `/api/streaming/stream?magnet_link=${encodeURIComponent(magnetLink)}&file_index=${file.index}`;

  return (
    <div className="w-full rounded-lg overflow-hidden border border-gray-700 shadow-lg">
      <div className="relative aspect-video">
        <video
          autoPlay
          controls
          playsInline
          ref={videoRef}
          src={streamUrl}
          preload="metadata"
          className="w-full h-full bg-[#000] object-contain focus:outline-none focus:border-0"
        />

        {isLoading && (
          <>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#000] bg-opacity-50 text-white">
              <p className="text-center animate-pulse">
                Please wait, we are processing the video...
                <br /> See the progress below
              </p>
            </div>

            {isLoading && (
              <div className="absolute" style={{ width: '100%', background: '#ddd', height: '8px' }}>
                <div
                  style={{
                    height: '100%',
                    background: '#364153',
                    width: `${progressBar}%`,
                    transition: 'width 0.1s linear',
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Simple Info Bar */}
      <div className="p-4 bg-gray-900 text-white flex flex-col md:flex-row justify-between md:items-center">
        <h3 className="font-semibold text-lg truncate">{file.name}</h3>
        <p className="text-sm text-gray-400">{file.size_mb.toFixed(1)} MB</p>
      </div>
    </div>
  );
};

export default AdvancedVideoPlayer;
