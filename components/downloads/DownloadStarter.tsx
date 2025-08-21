'use client';
import { useState } from 'react';
import { useDownloadManager } from '@/app/_hooks/useDownloadManager';
import { fetchTorrentMetadata } from '@/app/_queries/downloads';
import { TorrentFileEntry } from '@/app/_types/downloads';
import { formatBytes } from '@/lib/utils';

export const DownloadStarter = () => {
  const { start, downloads } = useDownloadManager();
  const [magnetLink, setMagnet] = useState('');
  const [fileIndex, setFileIndex] = useState<number>(0);
  const [chunkSize, setChunkSize] = useState<number | ''>('');
  const [files, setFiles] = useState<TorrentFileEntry[] | null>(null);
  const [metaLoading, setMetaLoading] = useState(false);
  const [metaError, setMetaError] = useState<string | null>(null);
  const existing = downloads.find((d) => d.magnetLink === magnetLink && d.fileIndex === fileIndex);

  async function handleStart(e: React.FormEvent) {
    e.preventDefault();
    await start({ magnetLink, fileIndex, chunkSize: chunkSize ? Number(chunkSize) : undefined });
  }

  async function loadMetadata() {
    setMetaLoading(true);
    setMetaError(null);
    setFiles(null);
    try {
      const meta = await fetchTorrentMetadata(magnetLink);
      setFiles(meta.files);
      setFileIndex(meta.files[0]?.index ?? 0);
    } catch (e) {
      setMetaError((e as Error).message);
    } finally {
      setMetaLoading(false);
    }
  }

  return (
    <form onSubmit={handleStart} className="space-y-3 bg-neutral-900/60 p-4 rounded-md border border-neutral-800">
      <div className="flex flex-col gap-1">
        <label className="text-xs uppercase tracking-wide text-neutral-400">Magnet Link</label>
        <textarea
          required
          value={magnetLink}
          onChange={(e) => setMagnet(e.target.value)}
          className="w-full rounded bg-neutral-800 p-2 text-sm h-20"
          placeholder="magnet:?xt=urn:btih:..."
        />
      </div>
      <div className="flex gap-2 flex-wrap items-center">
        <button
          type="button"
          onClick={loadMetadata}
          disabled={!magnetLink || metaLoading}
          className="px-3 py-2 bg-neutral-700 hover:bg-neutral-600 disabled:opacity-50 rounded text-sm"
        >
          {metaLoading ? 'Loading...' : 'Fetch Files'}
        </button>
        {metaError && <span className="text-xs text-red-400">{metaError}</span>}
        {files && !files.length && <span className="text-xs text-amber-400">No files returned</span>}
      </div>
      {files && files.length > 0 && (
        <div className="max-h-48 overflow-y-auto border border-neutral-800 rounded p-2 text-xs space-y-1 bg-neutral-950/60">
          {files.map((f) => (
            <button
              type="button"
              key={f.index}
              onClick={() => setFileIndex(f.index)}
              className={`w-full text-left px-2 py-1 rounded hover:bg-neutral-800 ${fileIndex === f.index ? 'bg-neutral-800' : ''}`}
            >
              <span className="font-mono mr-2">[{f.index}]</span>
              {f.name} <span className="text-neutral-400 ml-1">({formatBytes(f.size_bytes)})</span>
              {!f.is_video && <span className="ml-2 text-amber-400">non-video</span>}
            </button>
          ))}
        </div>
      )}
      <div className="flex gap-4 flex-wrap">
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase tracking-wide text-neutral-400">File Index</label>
          <input
            type="number"
            min={0}
            value={fileIndex}
            onChange={(e) => setFileIndex(Number(e.target.value))}
            className="rounded bg-neutral-800 px-2 py-1 text-sm w-28"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase tracking-wide text-neutral-400">Chunk Size (bytes)</label>
          <input
            type="number"
            min={1024 * 1024}
            value={chunkSize}
            onChange={(e) => setChunkSize(e.target.value ? Number(e.target.value) : '')}
            className="rounded bg-neutral-800 px-2 py-1 text-sm w-40"
            placeholder="default"
          />
        </div>
      </div>
      <button
        disabled={!magnetLink || !!existing}
        type="submit"
        className="px-3 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded text-sm font-medium"
      >
        {existing ? 'Already Added' : 'Start Download'}
      </button>
    </form>
  );
};
