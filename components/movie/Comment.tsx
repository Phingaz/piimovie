"use client";
import { motion } from "framer-motion";
import React, { useState } from "react";

const MAX_HEIGHT = 55;

const Comment = ({ comment }: { comment: string }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative">
      <motion.p
        initial={{ height: MAX_HEIGHT }}
        animate={{ height: expanded ? "auto" : MAX_HEIGHT }}
        transition={{ duration: 0.3 }}
        className={`text-gray-300 text-[12px] overflow-hidden ${
          expanded ? "line-clamp-none" : "line-clamp-3"
        }`}
      >
        {comment}
      </motion.p>

      <button
        onClick={() => setExpanded(!expanded)}
        className="text-blue-500 font-medium hover:scale-105 transition-all text-[12px] mt-2 cursor-pointer"
      >
        {expanded ? "See Less" : "See More"}
      </button>
    </div>
  );
};

export default Comment;
