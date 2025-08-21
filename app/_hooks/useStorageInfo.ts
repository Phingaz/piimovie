'use client';
import { useEffect, useState } from 'react';
import { db } from '@/lib/download-db';
import { StorageInfo } from '../_types/downloads';

async function calcDbUsage(): Promise<number> {
  // Rough sum of chunk sizes
  const chunks = await db.chunks.toArray();
  return chunks.reduce((a, c) => a + (c.size || 0), 0);
}

export function useStorageInfo(pollMs = 4000) {
  const [info, setInfo] = useState<StorageInfo>({ quota: 0, usage: 0, available: 0 });

  useEffect(() => {
    let cancelled = false;
    const update = async () => {
      try {
        let quota = 0,
          usage = 0;
        if (navigator.storage?.estimate) {
          const est = await navigator.storage.estimate();
          quota = est.quota || 0;
          usage = est.usage || 0;
        }
        const dbUsage = await calcDbUsage();
        const totalUsage = Math.max(usage, dbUsage); // ensure not under-reporting
        if (!cancelled) setInfo({ quota, usage: totalUsage, available: quota - totalUsage });
      } catch {
        /* ignore */
      }
      if (!cancelled) setTimeout(update, pollMs);
    };
    update();
    return () => {
      cancelled = true;
    };
  }, [pollMs]);

  return info;
}
