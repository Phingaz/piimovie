"use client";
import { motion } from "framer-motion";
import { Film, Frown } from "lucide-react";
import React from "react";

const EmptyList = ({ type, message }: { type?: string; message: string }) => {
  return (
    <div className="w-full rounded-md border border-dashed border-gray-500/50">
      <div className="flex flex-col items-center justify-center py-12 text-center px-3">
        <div className="relative mb-4">
          <motion.div
            initial={{ opacity: 0.5, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              duration: 2,
            }}
          >
            <Film className="w-16 h-16 text-muted-foreground/60" />
          </motion.div>
          <motion.div
            className="absolute -bottom-1 -right-1"
            initial={{ opacity: 0.7, rotate: 0 }}
            animate={{ opacity: 1, rotate: 360 }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 10,
              ease: "linear",
            }}
          >
            <Frown className="w-8 h-8 text-muted-foreground/80" />
          </motion.div>
        </div>

        {type && <h3 className="text-xl font-medium mb-2 text-gray-300">No {type}</h3>}
        <p className="text-muted-foreground max-w-md mb-6">{message}</p>
      </div>
    </div>
  );
};

export default EmptyList;
