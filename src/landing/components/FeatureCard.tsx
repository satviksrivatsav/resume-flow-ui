import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  isActive: boolean;
  onClick: () => void;
}

export const FeatureCard = ({
  title,
  description,
  icon: Icon,
  isActive,
  onClick,
}: FeatureCardProps) => {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -2 }}
      className={cn(
        'relative p-8 rounded-[2rem] cursor-pointer transition-all duration-300',
        'bg-white/[0.03] backdrop-blur-xl border border-white/[0.08]',
        'hover:border-white/20 hover:bg-white/[0.05]',
        isActive && 'border-white/25 bg-white/[0.08]',
      )}
    >
      <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center mb-6">
        <Icon className="w-6 h-6 text-zinc-400" />
      </div>
      <h3 className="text-xl font-medium text-white mb-3 tracking-tight">{title}</h3>
      <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
};
