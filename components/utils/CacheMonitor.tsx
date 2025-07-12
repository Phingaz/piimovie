'use client';

import React from 'react';
import { useCache } from '@/app/_hooks/useCache';
import { Button } from '@/components/ui/button';
import { RefreshCw, Trash2, Sparkles, BarChart3, X } from 'lucide-react';

interface CacheMonitorProps {
  className?: string;
}

export const CacheMonitor: React.FC<CacheMonitorProps> = ({ className }) => {
  const {
    stats,
    debugInfo,
    isLoading,
    error,
    refresh,
    clearCache,
    clearByPattern,
    cleanup,
    resetStats,
    fetchDebugInfo,
  } = useCache();

  const handleClearCache = async () => {
    if (confirm('Are you sure you want to clear all cache entries?')) {
      try {
        await clearCache();
        alert('Cache cleared successfully!');
      } catch {
        alert('Failed to clear cache');
      }
    }
  };

  const handleCleanup = async () => {
    try {
      const cleanedCount = await cleanup();
      alert(`Cleaned up ${cleanedCount} expired entries`);
    } catch {
      alert('Failed to cleanup cache');
    }
  };

  const handleClearItem = async (pattern: string) => {
    try {
      const deletedCount = await clearByPattern(pattern);
      alert(`Cleared ${deletedCount} cache entries`);
      fetchDebugInfo(); 
    } catch {
      alert('Failed to clear cache item');
    }
  };

  const handleResetStats = async () => {
    if (confirm('Are you sure you want to reset cache statistics?')) {
      try {
        await resetStats();
        alert('Cache statistics reset successfully!');
      } catch {
        alert('Failed to reset cache statistics');
      }
    }
  };

  if (error) {
    return (
      <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
        <div className="text-red-500 text-lg font-semibold mb-2">Cache Monitor Error</div>
        <p className="text-red-400 mb-4">{error}</p>
        <Button onClick={refresh} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Cache Monitor
          </h2>
          <p className="text-gray-400 text-sm">Monitor and manage application cache performance</p>
        </div>
        <Button variant="outline" size="sm" onClick={refresh} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Cache Statistics */}
      {stats && (
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-3 text-gray-300">Cache Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center bg-gray-700 rounded-lg p-3">
                <div className="text-2xl font-bold text-green-400">{stats.hits}</div>
                <div className="text-xs text-gray-400">Hits</div>
              </div>
              <div className="text-center bg-gray-700 rounded-lg p-3">
                <div className="text-2xl font-bold text-red-400">{stats.misses}</div>
                <div className="text-xs text-gray-400">Misses</div>
              </div>
              <div className="text-center bg-gray-700 rounded-lg p-3">
                <div className="text-2xl font-bold text-blue-400">{stats.size}</div>
                <div className="text-xs text-gray-400">Entries</div>
              </div>
              <div className="text-center bg-gray-700 rounded-lg p-3">
                <div className="text-2xl font-bold text-purple-400">{stats.hitRate.toFixed(1)}%</div>
                <div className="text-xs text-gray-400">Hit Rate</div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-600 pt-4">
            {/* Performance Status */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-300">Performance Status</span>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  stats.hitRate >= 70
                    ? 'bg-green-600 text-green-100'
                    : stats.hitRate >= 50
                      ? 'bg-yellow-600 text-yellow-100'
                      : 'bg-red-600 text-red-100'
                }`}
              >
                {stats.hitRate >= 70 ? 'Excellent' : stats.hitRate >= 50 ? 'Good' : 'Poor'}
              </span>
            </div>

            {/* Total Requests */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-300">Total Requests</span>
              <span className="text-sm text-gray-400">{stats.totalRequests.toLocaleString()}</span>
            </div>
          </div>

          <div className="border-t border-gray-600 pt-4">
            {/* Cache Actions */}
            <h3 className="text-sm font-medium mb-3 text-gray-300">Cache Management</h3>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={handleCleanup} disabled={isLoading}>
                <Sparkles className="w-4 h-4 mr-2" />
                Cleanup Expired
              </Button>
              <Button variant="outline" size="sm" onClick={handleResetStats} disabled={isLoading}>
                <BarChart3 className="w-4 h-4 mr-2" />
                Reset Stats
              </Button>
              <Button variant="destructive" size="sm" onClick={handleClearCache} disabled={isLoading}>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>

          {/* Cached Items List */}
          {debugInfo && debugInfo.keys.length > 0 && (
            <div className="border-t border-gray-600 pt-4">
              <h3 className="text-sm font-medium mb-3 text-gray-300">Cached Items ({debugInfo.totalKeys})</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {debugInfo.keys.map((key, index) => {
                  // Extract meaningful parts from the cache key
                  const isApiUrl = key.startsWith('https://');
                  let displayName = key;
                  let details = '';

                  if (isApiUrl) {
                    try {
                      const url = new URL(key.split(':')[0]);
                      const pathname = url.pathname;
                      const params = url.searchParams;

                      // Extract meaningful API endpoint info
                      if (pathname.includes('/discover/movie')) {
                        displayName = 'Movie Discovery';
                        const page = params.get('page') || '1';
                        const sortBy = params.get('sort_by') || 'popularity.desc';
                        details = `Page ${page}, Sort: ${sortBy.replace('.desc', ' ↓').replace('.asc', ' ↑')}`;
                      } else if (pathname.includes('/movie/')) {
                        displayName = 'Movie Details';
                        details = pathname.split('/').pop() || '';
                      } else if (pathname.includes('/tv/')) {
                        displayName = 'TV Show Details';
                        details = pathname.split('/').pop() || '';
                      } else {
                        displayName = pathname.split('/').pop() || 'API Request';
                        details = url.hostname;
                      }
                    } catch {
                      displayName = key.length > 50 ? key.substring(0, 50) + '...' : key;
                    }
                  } else {
                    displayName = key.length > 50 ? key.substring(0, 50) + '...' : key;
                  }

                  // Find matching top accessed entry for this key
                  const topAccessedEntry = debugInfo.topAccessed.find((entry) => entry.key === key);

                  return (
                    <div key={index} className="bg-gray-700 rounded p-3 text-sm">
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-200 truncate">{displayName}</div>
                          {details && <div className="text-xs text-gray-400 mt-1">{details}</div>}
                        </div>
                        <div className="flex items-start gap-2 ml-2 flex-shrink-0">
                          {topAccessedEntry && (
                            <div className="text-xs text-gray-400 text-right">
                              <div>Hits: {topAccessedEntry.accessCount}</div>
                              <div>Last: {new Date(topAccessedEntry.lastAccessed).toLocaleTimeString()}</div>
                            </div>
                          )}
                          <button
                            title="Clear this cache entry"
                            onClick={() => handleClearItem(key)}
                            className="p-1 border border-gray-500 hover:bg-gray-600 cursor-pointer rounded text-gray-400 hover:text-red-400 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      {key.length > 50 && <div className="text-xs text-gray-500 mt-2 break-all">{key}</div>}
                    </div>
                  );
                })}

                {debugInfo.totalKeys > debugInfo.keys.length && (
                  <div className="text-center py-2">
                    <span className="text-xs text-gray-500">
                      Showing {debugInfo.keys.length} of {debugInfo.totalKeys} cached items
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Performance Recommendations */}
          {stats.totalRequests > 50 && (
            <div className="border-t border-gray-600 pt-4">
              <h3 className="text-sm font-medium mb-2 text-gray-300">Recommendations</h3>
              <div className="text-xs text-gray-400 space-y-1">
                {stats.hitRate >= 70 ? (
                  <p className="text-green-400">✓ Cache is performing well</p>
                ) : stats.hitRate >= 50 ? (
                  <p className="text-yellow-400">⚠ Consider optimizing cache keys or increasing TTL</p>
                ) : (
                  <p className="text-red-400">⚠ Cache hit rate is low. Review caching strategy</p>
                )}
                {stats.size > 400 && (
                  <p className="text-yellow-400">⚠ Cache size is large. Consider reducing TTL or max size</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {isLoading && !stats && (
        <div className="text-center py-8">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-gray-400" />
          <p className="text-gray-400">Loading cache statistics...</p>
        </div>
      )}
    </div>
  );
};

export default CacheMonitor;
