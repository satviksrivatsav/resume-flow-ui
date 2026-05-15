import { motion } from 'framer-motion';
import { type LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

// ─── Animation presets ───────────────────────────────────────────────────────

const presets = {
  /** Bounces downward — great for download actions */
  bounceDown: {
    hover: { y: 3, transition: { type: 'spring', stiffness: 500, damping: 10 } },
    tap: { y: 6, scale: 0.9 },
  },
  /** Bounces upward — great for upload actions */
  bounceUp: {
    hover: { y: -3, transition: { type: 'spring', stiffness: 500, damping: 10 } },
    tap: { y: -5, scale: 0.9 },
  },
  /** Squashes vertically — blink effect (Eye icon) */
  blink: {
    hover: { scaleY: 0.55, transition: { type: 'spring', stiffness: 600, damping: 12 } },
    tap: { scaleY: 0.4, scale: 0.9 },
  },
  /** Slide right — logout / navigation forward */
  slideRight: {
    hover: { x: 3, transition: { type: 'spring', stiffness: 400, damping: 10 } },
    tap: { x: 5, scale: 0.9 },
  },
  /** Slide left — back navigation */
  slideLeft: {
    hover: { x: -3, transition: { type: 'spring', stiffness: 400, damping: 10 } },
    tap: { x: -5, scale: 0.9 },
  },
  /** Slide horizontally back and forth */
  slideH: {
    hover: { x: [-2, 2, -2, 0], transition: { duration: 0.35, ease: 'easeInOut' } },
    tap: { scale: 0.9 },
  },
  /** Slide vertically up and down */
  slideV: {
    hover: { y: [-2, 2, -2, 0], transition: { duration: 0.35, ease: 'easeInOut' } },
    tap: { scale: 0.9 },
  },
  /** Scale up — maximize / zoom-in */
  scaleUp: {
    hover: { scale: 1.3, transition: { type: 'spring', stiffness: 400, damping: 10 } },
    tap: { scale: 0.85 },
  },
  /** Scale down — zoom-out effect */
  scaleDown: {
    hover: { scale: 0.75, transition: { type: 'spring', stiffness: 400, damping: 10 } },
    tap: { scale: 0.6 },
  },
  /** Counter-clockwise spin — reset/undo */
  spinCCW: {
    hover: { rotate: -135, transition: { type: 'spring', stiffness: 300, damping: 12 } },
    tap: { rotate: -270, scale: 0.9 },
  },
  /** Clockwise spin */
  spinCW: {
    hover: { rotate: 90, transition: { duration: 0.3, ease: 'easeInOut' } },
    tap: { rotate: 180, scale: 0.9 },
  },
  /** Cross rotation — close / dismiss */
  crossSpin: {
    hover: { rotate: 90, transition: { type: 'spring', stiffness: 400, damping: 10 } },
    tap: { rotate: 135, scale: 0.85 },
  },
  /** Sparkle pulse — AI / magic actions */
  sparkle: {
    hover: {
      scale: [1, 1.3, 1.1, 1.25, 1],
      rotate: [0, -10, 10, -5, 0],
      transition: { duration: 0.5, ease: 'easeInOut' },
    },
    tap: { scale: 0.85 },
  },
  /**
   * Portal scroll — icon slides out one side, reappears from the other.
   * times: stay → exit left → jump to right (instant) → enter center
   */
  portal: {
    hover: {
      x: [0, -18, 18, 0],
      opacity: [1, 0, 0, 1],
      transition: {
        duration: 0.45,
        times: [0, 0.38, 0.42, 1],
        ease: 'easeInOut',
      },
    },
    tap: { scale: 0.85 },
  },
} as const;

export type AnimatedIconPreset = keyof typeof presets;

// ─── Component ───────────────────────────────────────────────────────────────

interface AnimatedIconProps {
  /** The Lucide icon component to render */
  icon: LucideIcon;
  /** Named animation preset */
  preset: AnimatedIconPreset;
  /** Extra classes forwarded to the icon */
  className?: string;
  /** Forwarded inline styles */
  style?: React.CSSProperties;
}

/**
 * Wraps a Lucide icon in a framer-motion span.
 *
 * Usage — put `whileHover="hover" whileTap="tap"` on the **parent** button
 * (or any ancestor motion element) and framer-motion will propagate the
 * variant name down to this component automatically.
 *
 * ```tsx
 * <motion.div whileHover="hover" whileTap="tap">
 *   <Button>
 *     <AnimatedIcon icon={Download} preset="bounceDown" className="w-4 h-4" />
 *     Download
 *   </Button>
 * </motion.div>
 * ```
 */
export function AnimatedIcon({ icon: Icon, preset, className, style }: AnimatedIconProps) {
  return (
    <motion.span
      variants={{
        initial: { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 },
        ...(presets[preset] as any),
      }}
      initial={false}
      className="inline-flex items-center justify-center"
      style={{ display: 'inline-flex', ...style }}
    >
      <Icon className={cn('shrink-0', className)} style={style} />
    </motion.span>
  );
}
