'use client';

import { useState } from 'react';
import {
  File,
  HardDrive,
  Upload,
  Download,
  Tag,
  User,
  Calendar,
  Link,
  Hash,
  Magnet,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';
import { formatDownloadDate } from '@/lib/utils';
import { DownlodResult } from '@/app/_types/utils';

export default function TorrentItem({ torrent }: { torrent: DownlodResult }) {
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedMagnet, setCopiedMagnet] = useState(false);

  const copyToClipboard = async (text: string, type: 'hash' | 'magnet') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'hash') {
        setCopiedHash(true);
        setTimeout(() => setCopiedHash(false), 2000);
      } else {
        setCopiedMagnet(true);
        setTimeout(() => setCopiedMagnet(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-3 hover:bg-gray-750 duration-200 border border-gray-900 shadow shadow-gray-500 hover:scale-[1.005] transition-all">
      {/* Torrent Name */}
      <div className="flex items-start mb-2">
        <File className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
        <div className="ml-2 flex-grow">
          <h3 className="font-medium text-white break-all text-[13px] md:text-base">{torrent.name}</h3>
        </div>
      </div>

      {/* Main Info Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-1">
        {/* Left Column - Stats */}
        <div className="flex items-center flex-wrap gap-x-4 gap">
          <div className="flex items-center">
            <HardDrive className="w-4 h-4 text-gray-300" />
            <span className="ml-1 text-[13px] text-gray-300">{torrent.size}</span>
          </div>

          <div className="flex items-center flex-wrap text-gray-400">
            <Upload size={16} />
            <span className="ml-1 text-[13px]">{torrent.seeders}</span>
          </div>

          <div className="flex items-center text-gray-400">
            <Download size={16} />
            <span className="ml-1 text-[13px]">{torrent.leechers}</span>
          </div>

          <div className="flex items-center text-gray-400">
            <Tag size={16} />
            <span className="ml-1 text-[13px]">{torrent.category}</span>
          </div>
        </div>

        {/* Right Column - Meta */}
        <div className="flex items-center flex-wrap gap-x-4 gap">
          <div className="flex items-center">
            <User className="w-4 h-4 text-gray-400" />
            <span className="ml-1 text-[13px] text-gray-400">{torrent.uploader}</span>
          </div>

          <div className="flex items-center text-gray-400">
            <Calendar size={16} />
            <span className="ml-1 text-[13px]">{formatDownloadDate(torrent.date)}</span>
          </div>

          <div className="flex items-center">
            <Magnet className="w-4 h-4 text-red-400" />
            <a
              href={torrent.magnet}
              className="ml-1 text-[13px] text-red-400 hover:text-red-300 transition-colors"
              aria-label="Open magnet link"
            >
              Magnet
            </a>
            <button
              onClick={() => copyToClipboard(torrent.magnet, 'magnet')}
              className="ml-1 text-gray-400 hover:text-white transition-colors"
              aria-label="Copy magnet link"
            >
              {copiedMagnet ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row - URL and Hash */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
        {/* URL */}
        <div className="flex items-center">
          <Link className="w-3.5 h-3.5 text-blue-400" />
          <a
            href={torrent.url}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 text-blue-400 hover:underline flex items-center truncate"
          >
            {torrent.url.length > 40 ? `${torrent.url.substring(0, 40)}...` : torrent.url}
            <ExternalLink className="w-2.5 h-2.5 ml-1 flex-shrink-0" />
          </a>
        </div>

        {/* Hash */}
        <div className="flex items-center">
          <Hash className="w-3.5 h-3.5 text-gray-400" />
          <div className="ml-1 font-mono flex items-center">
            <span className="truncate max-w-[150px] md:max-w-[200px] text-gray-400">{torrent.hash}</span>
            <button
              onClick={() => copyToClipboard(torrent.hash, 'hash')}
              className="ml-1 text-gray-400 hover:text-white transition-colors flex-shrink-0"
              aria-label="Copy hash"
            >
              {copiedHash ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
