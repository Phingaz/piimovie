import { cn } from '@/lib/utils';
import React from 'react';
import { motion } from 'framer-motion';

const OverView = ({ overView }: { overView: string }) => {
  const [showMore, setShowMore] = React.useState(false);
  return (
    <motion.p
      onClick={() => setShowMore(!showMore)}
      className={cn('text-[15px] max-w-2xl cursor-pointer', showMore ? 'line-clamp-none' : 'line-clamp-3')}
      initial={{ opacity: 0, y: -1 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, type: 'spring' }}
    >
      {overView}
    </motion.p>
  );
};

export default OverView;
