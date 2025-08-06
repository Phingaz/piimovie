'use client';
import Image from 'next/image';
import React from 'react';
import { useCycle } from 'framer-motion';
import Link from 'next/link';
import { DownloadIcon, Heart, Search, PlayCircle } from 'lucide-react';
import { useMainCtx } from '@/app/_context/Main';
import SignInBtn from './SignInBtn';
import { UserDropDown } from './UserDropdown';
import HamBurger from './HamBurger';
import dynamic from 'next/dynamic';

const LinkSwitcher = dynamic(() => import('./LinkSwitcher'), { ssr: false });

const Header = () => {
  const { user } = useMainCtx();
  const [active, setActive] = React.useState(false);
  const [width, setWidth] = React.useState(0);

  const [mobileNav, toggleMobileNav] = useCycle(false, true);

  React.useEffect(() => {
    const handleScroll = () => {
      setActive(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  React.useEffect(() => {
    const handleWindowResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleWindowResize);

    if (width > 768 && mobileNav) {
      toggleMobileNav();
    }

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [mobileNav, toggleMobileNav, width]);

  return (
    <header
      className={`${
        active ? 'bg-black/90 backdrop-blur-sm bg-opacity-10' : ''
      } sticky top-0 left-0 h-[80px] z-[49] flex justify-between items-center overflow-x-clip text-gray-100`}
    >
      <div className="container">
        <div className="w-full mx-auto flex justify-between items-center">
          <Link href="/">
            <Image
              priority
              src="/logo.png"
              width={60}
              height={60}
              alt="logo"
              unoptimized
              className="object-contain size-[60px]"
            />
          </Link>

          <nav
            className={`md:flex justify-between items-center md:w-[90%] lg:w-[62%] ${mobileNav ? ' fixed top-0 right-0 bg-black h-[100vh] w-[270px] pt-10' : 'hidden'}`}
          >
            <div className="flex md:justify-between gap-5 font-[300] md:flex-row flex-col pt-20 md:pt-0 items-center w-full h-full">
              <div className="items-center flex gap-3 flex-col md:flex-row">
                <LinkSwitcher mobileNav={mobileNav} toggleMobileNav={toggleMobileNav} />
                <Link
                  href={`/listing`}
                  onClick={() => {
                    if (mobileNav) toggleMobileNav();

                    if (!window) return;
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-gray-200 w-fit font-semibold hover:text-blue-500 transition-colors t"
                >
                  Listing
                </Link>
              </div>

              <div className="flex items-center flex-col md:flex-row gap-4 min-w-fit">
                <div className="flex gap-3 items-center flex-row">
                  <Link
                    aria-label="search"
                    href="/search"
                    onClick={() => mobileNav && toggleMobileNav()}
                    className="text-gray-300 bg-gray-700/50 p-[6px] rounded-md w-fit"
                  >
                    <Search size={25} />
                  </Link>
                  <Link
                    aria-label="favorites"
                    href="/favorites"
                    onClick={() => mobileNav && toggleMobileNav()}
                    className="text-gray-300 bg-gray-700/50 p-[6px] rounded-md w-fit"
                  >
                    <Heart size={25} />
                  </Link>
                  <Link
                    aria-label="streaming"
                    href="/streaming"
                    onClick={() => mobileNav && toggleMobileNav()}
                    className="text-gray-300 bg-gray-700/50 p-[6px] rounded-md w-fit"
                  >
                    <PlayCircle size={25} />
                  </Link>
                  <Link
                    aria-label="download"
                    href="/download"
                    onClick={() => mobileNav && toggleMobileNav()}
                    className="text-gray-300 bg-gray-700/50 p-[6px] rounded-md w-fit"
                  >
                    <DownloadIcon size={25} />
                  </Link>
                </div>
                {user && <UserDropDown user={user} mobileNav={mobileNav} toggleMobileNav={toggleMobileNav} />}
                {!user && <SignInBtn />}
              </div>
            </div>
          </nav>

          <HamBurger mobileNav={mobileNav} toggleMobileNav={toggleMobileNav} />
        </div>
      </div>
    </header>
  );
};

export default Header;
