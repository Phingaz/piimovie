"use client";
import Image from "next/image";
import React from "react";
import { motion, useCycle } from "framer-motion";
import Link from "next/link";
import { DownloadIcon, Heart, Search } from "lucide-react";

const Header = () => {
  const [active, setActive] = React.useState(false);
  const [width, setWidth] = React.useState(0);

  const [mobileNav, toggleMobileNav] = useCycle(false, true);

  React.useEffect(() => {
    const handleScroll = () => {
      setActive(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  React.useEffect(() => {
    const handleWindowResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleWindowResize);

    if (width > 1023 && mobileNav) {
      toggleMobileNav();
    }

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [mobileNav, toggleMobileNav, width]);

  const links = [
    {
      label: "Movies",
      href: "/movies?list=now_playing",
    },
    {
      label: "Tv Shows",
      href: "/tv-shows",
    },
  ];

  return (
    <header
      className={`${
        active
          ? "bg-black/50 backdrop-blur-sm bg-opacity-10"
          : "backdrop-blur-[5px]"
      } sticky top-0 left-0 h-[80px] z-[99999] flex justify-between items-center overflow-x-clip text-gray-100 -mb-[80px]`}
    >
      <div className="w-[1350px] 3xl:w-[1750px] px-8 mx-auto">
        <div className="w-full mx-auto flex justify-between items-center">
          <Link href="/">
            <Image
              src="/logo.png"
              width={70}
              unoptimized
              height={0}
              alt="logo"
            />
          </Link>

          {/* nav */}
          <nav
            className={`lg:block ${
              mobileNav
                ? " fixed top-0 right-0 bg-black h-[100vh] w-[250px]"
                : "hidden"
            }`}
          >
            <ul className="flex gap-5 font-[300] flex-col lg:flex-row pt-20 lg:pt-0 items-center w-full h-full">
              {links.map((link) => (
                <li
                  key={link.href}
                  onClick={() => mobileNav && toggleMobileNav()}
                  className="min-w-fit"
                >
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
              <div className="flex gap-3 items-center">
                <Link
                  href="/search"
                  className="text-gray-300 bg-gray-700/50 p-[6px] rounded-md w-fit group"
                >
                  <Search size={25} className="group-hover:animate-bounce" />
                </Link>
                <Link
                  href="/favorites"
                  className="text-gray-300 bg-gray-700/50 p-[6px] rounded-md w-fit group"
                >
                  <Heart size={25} className="group-hover:animate-bounce" />
                </Link>
                <Link
                  href="/download"
                  className="text-gray-300 bg-gray-700/50 p-[6px] rounded-md w-fit group"
                >
                  <DownloadIcon
                    size={25}
                    className="group-hover:animate-bounce"
                  />
                </Link>
              </div>
            </ul>
          </nav>

          {/* mobileToggle */}
          <div className="relative z-10 content lg:hidden">
            <motion.button
              animate={mobileNav ? "open" : "closed"}
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
