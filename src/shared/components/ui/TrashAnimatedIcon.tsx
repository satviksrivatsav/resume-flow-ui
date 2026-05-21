import { motion } from 'framer-motion';

import { cn } from '@/shared/lib/utils';

interface TrashAnimatedIconProps {
  className?: string;
}

/**
 * A specialized trash icon with a "lid opening" animation on hover.
 * Must be used within a motion element that has whileHover="hover" and whileTap="tap".
 */
export const TrashAnimatedIcon = ({ className }: TrashAnimatedIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('w-full h-full', className)}
    >
      {/* Lid Group: includes the horizontal line and the handle */}
      <motion.g
        variants={{
          hover: {
            y: -2,
            rotate: 15,
            transition: { type: 'spring', stiffness: 600, damping: 15 },
          },
          tap: {
            y: -3,
            rotate: 25,
            transition: { duration: 0.1 },
          },
        }}
        initial={false}
        style={{ originX: '5px', originY: '6px' }} // Pivot point on the left side of the lid
      >
        <path d="M3 6h18" />
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      </motion.g>

      {/* Bin Body */}
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />

      {/* Vertical Lines inside the bin */}
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
};
