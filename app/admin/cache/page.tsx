'use client';

import CacheMonitor from '@/components/utils/CacheMonitor';

export default function CachePage() {
  return (
    <div className="container mx-auto py-8 flex flex-col items-center justify-center ">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Cache Management</h1>
        <p className="text-gray-400">Monitor and manage the application cache performance.</p>
      </div>

      <CacheMonitor className="w-full max-w-4xl mx-auto" />

      <div className="mt-8 text-sm text-gray-500">
        <p>
          <strong>Note:</strong> This page is for development and monitoring purposes.
        </p>
        <p>
          The cache system automatically manages API responses to improve performance. You can use this page to monitor
          cache statistics and perform maintenance tasks.
        </p>
      </div>
    </div>
  );
}
