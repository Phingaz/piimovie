'use client';
import Image from 'next/image';
import React from 'react';
import { motion, useCycle } from 'framer-motion';
import Link from 'next/link';
import { DownloadIcon, Heart, Loader2, LogOutIcon, Search } from 'lucide-react';
import { authClient } from '@/lib/auth';
import { links } from '@/lib/constants';
import { clientToastError } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useMainCtx } from '@/app/_context/Main';

const Header = () => {
  const { user } = useMainCtx();
  const [active, setActive] = React.useState(false);
  const [width, setWidth] = React.useState(0);

  const [mobileNav, toggleMobileNav] = useCycle(false, true);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setActive(window.scrollY > 200);
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

    if (width > 1023 && mobileNav) {
      toggleMobileNav();
    }

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [mobileNav, toggleMobileNav, width]);

  const googleAuthSignIn = async () => {
    if (loading) return;
    try {
      setLoading(true);
      await authClient.signIn.social({ provider: 'google' });
    } catch (error: unknown) {
      clientToastError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <header
      className={`${
        active ? 'bg-black/80 backdrop-blur-sm bg-opacity-10' : 'bg-black/40 backdrop-blur-[5px]'
      } sticky top-0 left-0 h-[80px] z-[99999] flex justify-between items-center overflow-x-clip text-gray-100`}
    >
      <div className="w-[1350px] 3xl:w-[1750px] px-8 mx-auto">
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

          {/* nav */}
          <nav
            className={`lg:flex justify-between items-center w-[62%] ${mobileNav ? ' fixed top-0 right-0 bg-black h-[100vh] w-[250px]' : 'hidden'}`}
          >
            <div className="flex gap-5 font-[300] flex-col lg:flex-row pt-20 lg:pt-0 items-center w-full h-full">
              {links.map((link) => (
                <p key={link.href} onClick={() => mobileNav && toggleMobileNav()} className="min-w-fit">
                  <Link href={link.href} className="text-lg font-[500]">
                    {link.label}
                  </Link>
                </p>
              ))}
              <div className="flex gap-3 items-center">
                <Link href="/search" className="text-gray-300 bg-gray-700/50 p-[6px] rounded-md w-fit">
                  <Search size={25} />
                </Link>
                <Link href="/favorites" className="text-gray-300 bg-gray-700/50 p-[6px] rounded-md w-fit">
                  <Heart size={25} />
                </Link>
                <Link href="/download" className="text-gray-300 bg-gray-700/50 p-[6px] rounded-md w-fit">
                  <DownloadIcon size={25} />
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-4 min-w-fit">
              {user ? (
                <Avatar>
                  <AvatarImage src={user.image ?? ''} alt={user.name} />
                  <AvatarFallback>{user.name}</AvatarFallback>
                </Avatar>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  className="flex items-center gap-3 w-fit bg-[#000] hover:bg-blue-950 px-3 transition-all text-gray-100 h-[40px] rounded-full text-sm cursor-pointer"
                  onClick={googleAuthSignIn}
                >
                  {loading ? (
                    <>
                      Please wait ... <Loader2 size={17} className="animate-spin" />
                    </>
                  ) : (
                    <>
                      <Image
                        width={20}
                        height={20}
                        src="/google.svg"
                        alt="google-logo"
                        className=" object-cover object-center min-w-fit size-[25px]"
                      />
                      Sign in with google
                    </>
                  )}
                </motion.button>
              )}
              {user && (
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  className="text-gray-300 h-[40px] p-[6px] rounded-md w-fit font-semibold text-lg cursor-pointer"
                  onClick={async () => {
                    await authClient.signOut();
                  }}
                >
                  <LogOutIcon strokeWidth={2} size={25} />
                </motion.button>
              )}
            </div>
          </nav>

          {/* mobileToggle */}
          <div className="relative z-10 content lg:hidden">
            <motion.button
              animate={mobileNav ? 'open' : 'closed'}
              className="flex flex-col justify-center items-center rounded-lg p-2 py-3 gap-[7px] cursor-pointer"
              onClick={() => toggleMobileNav()}
            >
              <motion.span
                variants={{
                  closed: { rotate: 0, y: 0 },
                  open: { rotate: 45, y: 11 },
                }}
                className="w-6 h-px bg-gray-400  block"
              ></motion.span>
              <motion.span
                variants={{
                  closed: { opacity: 1 },
                  open: { opacity: 0 },
                }}
                className="w-6 h-px bg-gray-400 block"
              ></motion.span>
              <motion.span
                variants={{
                  closed: { rotate: 0, y: 0 },
                  open: { rotate: -45, y: -5 },
                }}
                className="w-6 h-px bg-gray-400 block"
              ></motion.span>
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
