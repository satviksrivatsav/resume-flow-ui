import React, { useState, useEffect } from 'react';
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

const ATSPreview = () => {
  return (
    <div className="relative w-full max-w-[280px] aspect-[1/1.414] bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden shadow-2xl p-6 space-y-6">
      <div className="space-y-2">
        <div className="h-3 w-1/3 bg-zinc-800 rounded-sm" />
        <div className="h-2 w-full bg-zinc-900 rounded-sm" />
        <div className="h-2 w-full bg-zinc-900 rounded-sm" />
        <div className="h-2 w-2/3 bg-zinc-900 rounded-sm" />
      </div>

      <div className="space-y-3">
        <div className="h-3 w-1/4 bg-zinc-800 rounded-sm" />
        <div className="space-y-2">
          <div className="h-2 w-full bg-zinc-900 rounded-sm" />
          <div className="h-2 w-full bg-zinc-900 rounded-sm" />
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={{ 
                  backgroundColor: ["rgba(39, 39, 42, 1)", "rgba(255, 255, 255, 0.2)", "rgba(39, 39, 42, 1)"],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  delay: i * 0.4,
                  ease: "easeInOut" 
                }}
                className="h-4 w-12 bg-zinc-800 rounded-sm border border-zinc-700"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="h-3 w-1/3 bg-zinc-800 rounded-sm" />
        <div className="h-2 w-full bg-zinc-900 rounded-sm" />
        <div className="h-2 w-5/6 bg-zinc-900 rounded-sm" />
      </div>
      
      <motion.div 
        animate={{ top: ["0%", "100%", "0%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-0 right-0 h-[1px] bg-white/50 shadow-[0_0_15px_rgba(255,255,255,0.3)] z-10"
      />
      
      <motion.div 
        animate={{ 
            top: ["-50%", "100%", "-50%"],
            opacity: [0, 0.1, 0]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-0 right-0 h-[50%] bg-gradient-to-b from-transparent via-white/10 to-transparent z-0 pointer-events-none"
      />
    </div>
  );
};

const FormatPreview = () => {
  const [layout, setLayout] = useState('left');

  useEffect(() => {
    const interval = setInterval(() => {
      setLayout(prev => prev === 'left' ? 'center' : 'left');
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-[320px] h-full flex items-center justify-center">
      <AnimatePresence mode="wait">
        {layout === 'left' ? (
          <motion.div
            key="left"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-6 flex flex-col items-start gap-4 shadow-2xl"
          >
            <div className="space-y-1">
              <div className="h-4 w-32 bg-white/90 rounded-sm" />
              <div className="h-2 w-48 bg-zinc-800 rounded-sm" />
            </div>
            <div className="flex gap-4">
              <div className="h-2 w-20 bg-zinc-900 rounded-sm" />
              <div className="h-2 w-20 bg-zinc-900 rounded-sm" />
            </div>
            <div className="w-full h-px bg-zinc-800 mt-2" />
            <div className="space-y-2 w-full">
              <div className="h-2 w-full bg-zinc-900 rounded-sm" />
              <div className="h-2 w-full bg-zinc-900 rounded-sm" />
              <div className="h-2 w-2/3 bg-zinc-900 rounded-sm" />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-6 flex flex-col items-center text-center gap-4 shadow-2xl"
          >
            <div className="space-y-1 flex flex-col items-center">
              <div className="h-4 w-32 bg-white/90 rounded-sm" />
              <div className="h-2 w-48 bg-zinc-800 rounded-sm" />
            </div>
            <div className="flex gap-4">
              <div className="h-2 w-20 bg-zinc-900 rounded-sm" />
              <div className="h-2 w-20 bg-zinc-900 rounded-sm" />
            </div>
            <div className="w-full h-px bg-zinc-800 mt-2" />
            <div className="space-y-2 w-full flex flex-col items-center">
              <div className="h-2 w-full bg-zinc-900 rounded-sm" />
              <div className="h-2 w-full bg-zinc-900 rounded-sm" />
              <div className="h-2 w-2/3 bg-zinc-900 rounded-sm" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TemplatesPreview = () => {
  return (
    <div className="relative group overflow-hidden bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-[320px] aspect-video flex items-center justify-center p-8 shadow-2xl">
      <div className="w-full space-y-4 transform scale-110">
        <div className="flex items-center gap-3">
          <div className="text-[10px] font-bold tracking-widest text-white/50 uppercase">Core Skills</div>
          <div className="h-[1px] flex-1 bg-zinc-800" />
        </div>
        <div className="flex flex-wrap gap-2">
          {['React', 'TypeScript', 'Node.js', 'Next.js', 'Tailwind', 'GraphQL'].map((skill, i) => (
            <motion.span 
              key={skill}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className="px-2 py-1 text-[9px] font-medium text-zinc-300 bg-zinc-900 border border-zinc-800 rounded"
            >
              {skill}
            </motion.span>
          ))}
        </div>
        <div className="space-y-2 pt-2">
          <div className="flex items-center gap-3">
            <div className="text-[10px] font-bold tracking-widest text-white/50 uppercase">Proficiency</div>
            <div className="h-[1px] flex-1 bg-zinc-800" />
          </div>
          <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "85%" }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
              className="h-full bg-white/30" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};
