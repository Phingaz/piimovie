'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { imageCardUrl } from '@/lib/utils';
import { Network } from '@/app/types/utils';

export default function NetworkBadge({ network }: { network: Network }) {
  return (
    <motion.div
      className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-sm"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      {network.logo_path && (
        <div className="relative size-8">
          <Image src={imageCardUrl(network.logo_path)} alt={network.name} fill className="object-contain" />
        </div>
      )}
      <span className="text-sm">{network.name}</span>
    </motion.div>
  );
}
