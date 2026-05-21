/* eslint-disable react-refresh/only-export-components */
import { motion, Variants } from 'framer-motion';
import { useState } from 'react';

export const iconVariants: Record<string, Variants> = {
  Resumes: {
    initial: { y: 0 },
    hover: { y: -3, transition: { type: 'spring', stiffness: 400, damping: 10 } },
    tap: { y: 0, scale: 0.9 },
  },
  'ATS Reports': {
    initial: { y: 0 },
    hover: { y: -3, transition: { type: 'spring', stiffness: 400, damping: 10 } },
    tap: { y: 0, scale: 0.9 },
  },
  Profile: {
    initial: { y: 0 },
    hover: { y: -3, transition: { type: 'spring', stiffness: 400, damping: 10 } },
    tap: { y: 0, scale: 0.9 },
  },
  Settings: {
    initial: { rotate: 0 },
    hover: { rotate: 90, transition: { duration: 0.35, ease: 'easeInOut' } },
    tap: { rotate: 0, scale: 0.9 },
  },
  'Danger Zone': {
    initial: { rotate: 0 },
    hover: { rotate: [0, -10, 10, 0], transition: { duration: 0.4, ease: 'easeInOut' } },
    tap: { scale: 0.9 },
  },
};

export const NavItemWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  return (
    <motion.div
      onMouseEnter={() => setIsAnimating(true)}
      animate={isAnimating ? 'hover' : 'initial'}
      onAnimationComplete={() => {
        if (isAnimating) setIsAnimating(false);
      }}
      whileTap="tap"
      className={className}
    >
      {children}
    </motion.div>
  );
};
