import { motion } from 'framer-motion';
import React from 'react';

const HamBurger = ({ mobileNav, toggleMobileNav }: { mobileNav: boolean; toggleMobileNav: () => void }) => {
  return (
    <div className="relative z-5 content md:hidden">
      <motion.button
        aria-label="menu"
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
  );
};

export default HamBurger;
