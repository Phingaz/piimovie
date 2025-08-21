'use client'
import React from 'react';
import { DownloadList } from '@/components/downloads/DownloadList';
import { DownloadStarter } from '@/components/downloads/DownloadStarter';
import { useStorageInfo } from '@/app/_hooks/useStorageInfo';

function StorageBar() {
  const { quota, usage } = useStorageInfo(5000);
  if (!quota) return null;
  const pct = Math.min(100, (usage / quota) * 100);
  return (
    <div className="text-xs space-y-1">
      <div className="flex justify-between">
        <span>Storage</span>
        <span>{pct.toFixed(1)}%</span>
      </div>
      <div className="h-2 bg-neutral-800 rounded overflow-hidden">
        <div className="h-full bg-green-500" style={{ width: pct + '%' }} />
      </div>
    </div>
  );
}

const DownloadsPage = () => {
  return (
    <div className="container mx-auto mt-[100px] py-10 px-3 md:px-[2rem] space-y-8">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Downloads</h1>
        <p className="text-sm text-neutral-400">
          Manage active and completed downloads. Start new downloads using magnet link & file index.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <DownloadStarter />
          <StorageBar />
        </div>
      </div>
      <DownloadList />
    </div>
  );
};

export default DownloadsPage;
