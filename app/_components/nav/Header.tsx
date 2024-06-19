"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";
import Main from "@/app/_context/Main";
import { cn } from "@/lib/utils";
import { movieList } from "@/app/constants";

const Header = ({
  className,
  isExternal,
}: {
  className?: string;
  isExternal?: boolean;
}) => {
  const { isMobile, mobileNav, toggleMobileNav } = React.useContext(Main);
  const [active, setActive] = React.useState(false);
  const [width, setWidth] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      setActive(window.scrollY > 500);
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

    width > 1023 && mobileNav && toggleMobileNav();

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [mobileNav, toggleMobileNav, width]);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        `transition text-white ${
          active
            ? "bg-black/80 backdrop-blur-sm"
            : "bg-transparent backdrop-blur-sm"
        } fixed top-0 left-0 h-[80px] w-full z-[99] flex justify-between items-center px-3 md:px-8 overflow-x-clip`,
        className
      )}
    >
      <Link href="/" className="text-2xl font-bold">
        Logo
      </Link>

      <motion.nav
        initial={{ opacity: 0, width: 0 }}
        whileInView={{ opacity: 1, width: mobileNav ? "250px" : "auto" }}
        className={`lg:block ${
          mobileNav ? " fixed top-0 right-0 bg-black h-[100vh] " : "hidden"
        }`}
      >
        <ul className="flex gap-10 font-bold flex-col lg:flex-row pt-20 lg:pt-0 items-center w-full h-full uppercase">
          {movieList.map((link, i) => (
            <li key={i} onClick={() => isMobile && toggleMobileNav()}>
              <Link
                className="text-sm font-[500]"
                href={`/moviecollection?list=${link.id}`}
              >
                {link.name}
              </Link>
            </li>
          ))}
          <Link className="text-sm font-[500]" href={`/favorites`}>
            Favorites
          </Link>
          <Link className="text-sm font-[500]" href={`/search`}>
            Search
          </Link>
        </ul>
      </motion.nav>

      {/* mobileToggle */}
      <div className="relative z-10 content lg:hidden">
        <motion.button
          animate={mobileNav ? "open" : "closed"}
          className="flex flex-col justify-center items-center rounded-lg p-2 py-3 gap-[7px]"
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
    </motion.header>
  );
};

export default Header;
