'use client';
import { useDownloadManager } from '@/app/_hooks/useDownloadManager';
import { DownloadLifecycleState } from '@/app/_types/downloads';
import { formatBytes } from '@/lib/utils';
import { downloadService } from '@/lib/download-service';
import { toast } from 'sonner';

function stateColor(state: DownloadLifecycleState) {
  switch (state) {
    case DownloadLifecycleState.COMPLETED:
      return 'text-green-500';
    case DownloadLifecycleState.FAILED:
      return 'text-red-500';
    case DownloadLifecycleState.PAUSED:
      return 'text-yellow-500';
    default:
      return 'text-blue-400';
  }
}

export const DownloadList = () => {
  const { downloads, loading, error, pause, resume, cancel } = useDownloadManager();
  if (loading) return <div className="p-4 text-sm">Loading downloads...</div>;
  if (error) return <div className="p-4 text-sm text-red-500">{error}</div>;
  if (!downloads.length) return <div className="p-4 text-sm">No downloads yet.</div>;
  return (
    <div className="space-y-3 p-4">
      {downloads.map((d) => {
        const pct = d.progressPercentage.toFixed(1);
        const speedVal = d.downloadRate > 0 ? d.downloadRate : 0;
        const speed = speedVal ? `${formatBytes(speedVal)}/s` : '-';
        const remaining = Math.max(d.file_size - d.downloadedBytes, 0);
        const etaSec = speedVal ? remaining / speedVal : 0;
        const eta = speedVal ? (etaSec < 60 ? `${etaSec.toFixed(0)}s` : `${(etaSec / 60).toFixed(1)}m`) : '-';
        return (
          <div key={d.id} className="border rounded-md p-3 bg-neutral-900/40">
            <div className="flex justify-between gap-2">
              <span className="font-medium truncate" title={d.file_name}>
                {d.file_name}
              </span>
              <span className={`text-xs ${stateColor(d.lifecycle)}`}>{d.lifecycle}</span>
            </div>
            <div className="h-2 bg-neutral-700 rounded mt-2 overflow-hidden">
              <div className="h-full bg-blue-500 transition-all" style={{ width: `${pct}%` }} />
            </div>
            <div className="mt-1 text-xs flex flex-wrap gap-x-4 gap-y-1 text-neutral-300">
              <span>{pct}%</span>
              <span>
                {formatBytes(d.downloadedBytes)}/{formatBytes(d.file_size)}
              </span>
              <span>↓ {speed}</span>
              <span>Seeds {d.numSeeds}</span>
              <span>Peers {d.numPeers}</span>
              <span>Up {formatBytes(d.uploadRate)}/s</span>
              <span>ETA {eta}</span>
            </div>
            <div className="mt-2 flex gap-2 text-xs">
              {d.lifecycle === DownloadLifecycleState.DOWNLOADING && (
                <button onClick={() => pause(d.id)} className="px-2 py-1 bg-neutral-700 hover:bg-neutral-600 rounded">
                  Pause
                </button>
              )}
              {d.lifecycle === DownloadLifecycleState.PAUSED && (
                <button onClick={() => resume(d.id)} className="px-2 py-1 bg-neutral-700 hover:bg-neutral-600 rounded">
                  Resume
                </button>
              )}
              {d.lifecycle === DownloadLifecycleState.FAILED && (
                <button onClick={() => resume(d.id)} className="px-2 py-1 bg-neutral-700 hover:bg-neutral-600 rounded">
                  Retry
                </button>
              )}
              {d.lifecycle === DownloadLifecycleState.COMPLETED && (
                <button
                  onClick={async () => {
                    try {
                      const blob = await downloadService.getBlob(d.id);
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = d.file_name;
                      a.click();
                      setTimeout(() => URL.revokeObjectURL(url), 10_000);
                    } catch (e) {
                      toast.error((e as Error).message);
                    }
                  }}
                  className="px-2 py-1 bg-neutral-700 hover:bg-neutral-600 rounded"
                >
                  Save
                </button>
              )}
              <button
                onClick={() => cancel(d.id)}
                className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 rounded ml-auto text-red-400"
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
