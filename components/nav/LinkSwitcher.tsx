'use client';
import { Clapperboard, TvMinimalPlay } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

export default function LinkSwitcher({
  mobileNav,
  toggleMobileNav,
}: {
  mobileNav: boolean;
  toggleMobileNav: () => void;
}) {
  const router = useRouter();
  const path = usePathname().split('/')[1];

  return (
    <div className="relative p-[5px] bg-[#000] rounded-sm">
      <div
        className="absolute inset-y-1 transition-all duration-300 ease-in-out bg-gray-800 rounded-[3px] min-w-fit shadow-md"
        style={{
          width: '50%',
          transform: `translateX(${path === 'movie' ? '0%' : '92%'})`,
        }}
      />
      <div className="relative flex gap-10">
        <button
          className={`flex items-center justify-center py-1 px-2 min-w-fit text-sm transition-colors duration-300 rounded-[3px] ${
            path === 'movie' ? 'text-gray-100 font-[700]' : 'font-[400] text-gray-400 cursor-pointer'
          }`}
          onClick={() => {
            if (mobileNav) toggleMobileNav();
            router.push('/movie');
          }}
          aria-pressed={path === 'movie'}
        >
          <Clapperboard className="w-4 h-4 mr-2" />
          Movie
        </button>
        <button
          className={`flex items-center justify-center py-1 px-2 min-w-fit text-sm transition-colors duration-300 rounded-[3px] ${
            path === 'show' ? 'text-gray-100 font-[700]' : 'font-[400] text-gray-400 cursor-pointer'
          }`}
          onClick={() => {
            if (mobileNav) toggleMobileNav();
            router.push('/show');
          }}
          aria-pressed={path === 'show'}
        >
          <TvMinimalPlay className="w-4 h-4 mr-2" />
          Tv Shows
        </button>
      </div>
    </div>
  );
}
