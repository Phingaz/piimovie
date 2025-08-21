'use client';
import { useEffect, useState, useCallback } from 'react';
import { downloadService } from '@/lib/download-service';
import { toast } from 'sonner';
import { DownloadRecord, StartDownloadParams, DownloadLifecycleState } from '../_types/downloads';
import { db } from '@/lib/download-db';
import { liveQuery } from 'dexie';

export function useDownloadManager() {
  const [downloads, setDownloads] = useState<DownloadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sub = liveQuery(() => db.downloads.toArray()).subscribe({
      next: (rows) => {
        setDownloads(rows);
        setLoading(false);
      },
      error: (e) => {
        setError(String(e));
        setLoading(false);
      },
    });
    return () => sub.unsubscribe();
  }, []);

  const start = useCallback(async (params: StartDownloadParams) => {
    try {
      setError(null);
      const r = await downloadService.start(params);
      toast.success(r.alreadyExisted ? 'Download already added' : 'Download started');
    } catch (e) {
      const m = (e as Error).message;
      setError(m);
      toast.error(m);
    }
  }, []);
  const pause = useCallback(async (id: string) => {
    await downloadService.pause(id);
    toast.message('Paused');
  }, []);
  const resume = useCallback(async (id: string) => {
    await downloadService.resume(id);
    toast.message('Resumed');
  }, []);
  const cancel = useCallback(async (id: string) => {
    await downloadService.cancel(id);
    toast.message('Deleted');
  }, []);

  const activeCount = downloads.filter((d) =>
    [DownloadLifecycleState.DOWNLOADING, DownloadLifecycleState.QUEUED].includes(d.lifecycle),
  ).length;

  return { downloads, loading, error, start, pause, resume, cancel, activeCount };
}
