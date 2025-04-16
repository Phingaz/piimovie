'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { imageCardUrl } from '@/lib/utils';
import { CreatedBy } from '@/app/_types/utils';

export default function CreatorCard({ creator }: { creator: CreatedBy }) {
  return (
    <motion.div
      className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-md"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative size-8 rounded-full overflow-hidden flex-shrink-0">
        {creator.profile_path ? (
          <Image
            src={imageCardUrl(creator.profile_path)}
            alt={creator.name}
            fill
            className="object-cover object-center"
          />
        ) : (
          <p className="w-full h-full bg-gray-700 flex items-center justify-center text-sm">{creator.name.charAt(0)}</p>
        )}
      </div>
      <div>
        <h4 className="font-medium text-sm">{creator.name}</h4>
        <p className="text-xs text-gray-400">Creator</p>
      </div>
    </motion.div>
  );
}
