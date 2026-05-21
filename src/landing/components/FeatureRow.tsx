import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { ReactNode } from 'react';

import { cn } from '@/shared/lib/utils';

interface FeatureRowProps {
  title: string;
  description: string;
  bullets: string[];
  ctaText: string;
  mockup: ReactNode;
  reverse?: boolean;
  onClick?: () => void;
}

export const FeatureRow = ({
  title,
  description,
  bullets,
  ctaText,
  mockup,
  reverse = false,
  onClick,
}: FeatureRowProps) => {
  return (
    <div
      className={cn(
        'flex flex-col gap-12 items-center mb-32 last:mb-0',
        reverse ? 'lg:flex-row-reverse' : 'lg:flex-row',
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        style={{ willChange: 'transform, opacity, filter' }}
        className="flex-1 space-y-8 w-full"
      >
        <div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
            {title}
          </h2>
          <p className="mt-4 text-lg text-zinc-400 leading-relaxed max-w-xl">{description}</p>
        </div>

        <ul className="space-y-4">
          {bullets.map((bullet, idx) => (
            <li key={idx} className="flex items-start gap-3 text-zinc-300">
              <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-zinc-800/80 flex items-center justify-center border border-zinc-700/50">
                <Check className="w-3 h-3 text-zinc-300" />
              </div>
              <span className="leading-relaxed">{bullet}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={onClick}
          className="px-6 py-3 rounded-full bg-white text-black font-semibold hover:bg-zinc-200 transition-colors text-sm"
        >
          {ctaText}
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
        style={{ willChange: 'transform, opacity, filter' }}
        className="flex-1 w-full"
      >
        {mockup}
      </motion.div>
    </div>
  );
};
