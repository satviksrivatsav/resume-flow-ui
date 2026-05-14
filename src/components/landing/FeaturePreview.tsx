import { motion, AnimatePresence } from 'framer-motion';

export type FeatureKey = 'ai' | 'ats' | 'format' | 'templates';

interface FeaturePreviewProps {
  activeFeature: FeatureKey;
}

export const FeaturePreview = ({ activeFeature }: FeaturePreviewProps) => {
  return (
    <div data-testid="feature-preview" className="relative w-full aspect-video rounded-3xl overflow-hidden bg-white/[0.01] border border-white/[0.05] flex items-center justify-center p-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFeature}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="w-full h-full flex items-center justify-center"
        >
          {activeFeature === 'ai' && <AIPreview />}
          {activeFeature === 'ats' && <ATSPreview />}
          {activeFeature === 'format' && <FormatPreview />}
          {activeFeature === 'templates' && <TemplatesPreview />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Simplified sub-components for now
const AIPreview = () => (
  <div className="w-full max-w-sm space-y-4">
    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-zinc-500 font-mono">
      Developed a high-performance distributed systems architecture...
    </div>
    <div className="flex justify-center text-zinc-600">↓</div>
    <div className="p-4 rounded-xl bg-white/[0.05] border border-white/20 text-xs text-white font-mono">
      Architected high-scale distributed systems, improving throughput by 40%...
    </div>
  </div>
);

const ATSPreview = () => <div className="text-zinc-500 text-sm italic">ATS Preview Placeholder</div>;
const FormatPreview = () => <div className="text-zinc-500 text-sm italic">Format Preview Placeholder</div>;
const TemplatesPreview = () => <div className="text-zinc-500 text-sm italic">Templates Preview Placeholder</div>;
