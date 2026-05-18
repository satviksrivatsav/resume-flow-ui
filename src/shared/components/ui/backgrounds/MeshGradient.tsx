import { motion } from 'framer-motion';
import React from 'react';

import { cn } from '@/shared/lib/utils';

export const MeshGradient = ({ className }: { className?: string }) => {
  return (
    <div className={cn('absolute inset-0 z-0 overflow-hidden bg-black', className)}>
      <motion.div
        animate={{
          x: [-100, 100, -50],
          y: [-100, 50, 100],
          scale: [1, 1.2, 0.9],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
        className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-zinc-800/30 blur-[120px]"
      />
      <motion.div
        animate={{
          x: [100, -50, 50],
          y: [100, -100, -50],
          scale: [0.8, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
        className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-zinc-700/20 blur-[150px]"
      />
      <motion.div
        animate={{
          x: [0, 50, -50],
          y: [0, -50, 50],
          scale: [1, 0.8, 1.2],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
        className="absolute top-[30%] right-[20%] w-[40%] h-[40%] rounded-full bg-zinc-900/40 blur-[100px]"
      />
    </div>
  );
};
