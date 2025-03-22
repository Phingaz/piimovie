'use client';
import useCookies from '@/app/_hooks/useCookies';
import { Clapperboard, TvMinimalPlay } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

export default function LinkSwitcher({
  mobileNav,
  toggleMobileNav,
}: {
  mobileNav: boolean;
  toggleMobileNav: () => void;
}) {
  const router = useRouter();
  const path = usePathname().split('/')[1];
  const { getCookie, setCookie } = useCookies();
  const t = getCookie('t');

  React.useEffect(() => {
    if (!t) setCookie('t', 'movie');
  }, [t, setCookie]);

  return (
    <div className="relative p-[5px] bg-[#000] rounded-sm w-[240px]">
      <div
        className="absolute inset-y-1 transition-all duration-300 ease-in-out bg-gray-800 z-1 rounded-[4px]"
        style={{
          width: t === 'movie' ? '43%' : '47%',
          transform: `translateX(${path === 'movie' ? '0%' : '105%'})`,
        }}
      ></div>
      <div className="flex justify-between items-center w-full gap-5">
        <button
          className={`flex items-center justify-center py-1 px-2 z-2 min-w-fit text-sm transition-colors duration-300 rounded-[3px] w-full ${
            path === 'movie' ? 'text-gray-100 font-[700]' : 'font-[400] text-gray-400 cursor-pointer'
          }`}
          onClick={() => {
            if (mobileNav) toggleMobileNav();
            setCookie('t', 'movie');
            router.push('/movie');
          }}
          aria-pressed={path === 'movie'}
        >
          <Clapperboard className="w-4 h-4 mr-2" />
          Movie
        </button>
        <button
          className={`flex items-center justify-center py-1 z-2 px-2 min-w-fit text-sm transition-colors duration-300 rounded-[3px] ${
            path === 'tv' ? 'text-gray-100 font-[700]' : 'font-[400] text-gray-400 cursor-pointer'
          }`}
          onClick={() => {
            if (mobileNav) toggleMobileNav();
            setCookie('t', 'tv');
            router.push('/tv');
          }}
          aria-pressed={path === 'tv'}
        >
          <TvMinimalPlay className="w-4 h-4 mr-2" />
          Tv Shows
        </button>
      </div>
    </div>
  );
}
