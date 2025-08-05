import { format } from 'date-fns';
import CopyButton from './buttons/CopyButton';
import StreamButton from './buttons/StreamButton';
import { DownlodResult } from '@/app/_types/utils';
import { File, HardDrive, Upload, Download, Tag, User, Calendar, Link, Hash, Magnet, ExternalLink } from 'lucide-react';

export default function TorrentItem({ torrent }: { torrent: DownlodResult }) {
  const cleanDate = (date: string | number) => {
    if (typeof date === 'string') {
      console.log('Received date:', date);

      if (date.toLowerCase() === 'y-day' || date.toLowerCase() === 'yesterday') {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return format(yesterday, 'MMM dd, yyyy');
      }

      // Parse date formats like "07-25 10:41" or "08-12 2023"
      const dateMatch = date.match(/(\d{2})-(\d{2})(?:\s+(\d{2}):(\d{2})|(?:\s+(\d{4})))?/);
      if (dateMatch) {
        const month = parseInt(dateMatch[1]) - 1; // Months are 0-indexed in JS
        const day = parseInt(dateMatch[2]);
        const year = dateMatch[5] ? parseInt(dateMatch[5]) : new Date().getFullYear();

        const parsedDate = new Date();
        parsedDate.setFullYear(year, month, day);

        if (dateMatch[3] && dateMatch[4]) {
          parsedDate.setHours(parseInt(dateMatch[3]), parseInt(dateMatch[4]));
        }

        return format(parsedDate, 'MMM dd, yyyy');
      }

      try {
        return format(new Date(date), 'MMM dd, yyyy');
      } catch {
        return format(new Date(), 'MMM dd, yyyy');
      }
    }

    if (typeof date === 'number') {
      return format(new Date(date), 'MMM dd, yyyy');
    }
    return format(new Date(), 'MMM dd, yyyy');
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
            <span className="ml-1 text-[13px]">{cleanDate(torrent?.date)}</span>
          </div>

          <div className="flex items-center gap-2">
            <StreamButton magnetLink={torrent.magnet} title={torrent.name} isLarge={false} />
            <a
              href={torrent.magnet}
              aria-label="Open magnet link"
              className="p-[6px] bg-red-800 rounded-sm text-red-100 hover:bg-red-700 transition-colors"
            >
              <Magnet className="size-4" />
            </a>
            <CopyButton text={torrent.magnet} />
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
            <span className="truncate max-w-[150px] md:max-w-[450px] mr-2 text-gray-400">{torrent.hash}</span>
            <CopyButton text={torrent.hash} />
          </div>
        </div>
      </div>
    </div>
  );
}
