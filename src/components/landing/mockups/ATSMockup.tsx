import { motion } from 'framer-motion';

export const ATSMockup = () => {
  return (
    <div className="w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-square xl:aspect-[4/3] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden relative flex flex-col items-center justify-center p-6 gap-8">
      
      {/* Score Ring */}
      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-zinc-800" />
          <motion.circle 
            cx="50" cy="50" r="40" 
            stroke="currentColor" 
            strokeWidth="8" 
            fill="transparent" 
            strokeDasharray="251.2"
            initial={{ strokeDashoffset: 251.2 }}
            whileInView={{ strokeDashoffset: 251.2 * (1 - 0.85) }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="text-white" 
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-3xl font-bold text-white tracking-tighter"
          >
            85
          </motion.span>
        </div>
      </div>

      {/* Checklist */}
      <div className="w-full max-w-xs space-y-2">
        <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900 border border-zinc-800">
          <span className="text-sm font-medium text-white">Keywords Match</span>
          <span className="text-xs font-semibold px-2 py-1 rounded bg-zinc-800 text-zinc-300">Needs Work</span>
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900 border border-zinc-800">
          <span className="text-sm font-medium text-white">Formatting</span>
          <span className="text-xs font-semibold px-2 py-1 rounded bg-white text-black">Passed</span>
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900 border border-zinc-800">
          <span className="text-sm font-medium text-white">Action Verbs</span>
          <span className="text-xs font-semibold px-2 py-1 rounded bg-white text-black">Passed</span>
        </div>
      </div>

    </div>
  );
};
