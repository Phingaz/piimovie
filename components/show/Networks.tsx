'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { imageCardUrl } from '@/lib/utils';
import { Network } from '@/app/_types/utils';

export default function NetworkBadge({ network }: { network: Network }) {
  return (
    <motion.div
      className="flex items-center gap-1 rounded-sm flex-col border border-gray-800"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative size-10">
        {network.logo_path && (
          <Image src={imageCardUrl(network.logo_path)} alt={network.name} fill className="object-contain" />
        )}
      </div>
      <p className="text-[10px] text-gray-400">{network.name}</p>
    </motion.div>
  );
}
