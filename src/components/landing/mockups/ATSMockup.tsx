import { motion } from 'framer-motion';

export const ATSMockup = () => {
  return (
    <div className="w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-square xl:aspect-[4/3] relative flex flex-col items-center justify-center overflow-hidden p-4 gap-8">
      
      <div className="relative z-10 w-full flex flex-col items-center justify-center gap-8">
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
              animate={{ strokeDashoffset: [251.2, 251.2 * (1 - 0.85), 251.2 * (1 - 0.85), 251.2] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", times: [0, 0.4, 0.8, 1] }}
              className="text-white" 
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span 
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ duration: 4, repeat: Infinity, times: [0, 0.4, 0.8, 1] }}
              className="text-3xl font-bold text-white tracking-tighter"
            >
              85
            </motion.span>
          </div>
        </div>

        {/* Checklist */}
        <div className="w-full max-w-xs space-y-2">
          {[
            { label: "Keywords Match", status: "Needs Work", passed: false },
            { label: "Formatting", status: "Passed", passed: true },
            { label: "Action Verbs", status: "Passed", passed: true }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              animate={{ opacity: [0.3, 1, 1, 0.3], y: [5, 0, 0, 5] }}
              transition={{ duration: 4, repeat: Infinity, delay: idx * 0.2, times: [0, 0.2, 0.8, 1] }}
              className="flex items-center justify-between p-3 rounded-lg bg-zinc-900 border border-zinc-800 shadow-lg"
            >
              <span className="text-sm font-medium text-white">{item.label}</span>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${item.passed ? "bg-white text-black" : "bg-zinc-800 text-zinc-400 border border-zinc-700"}`}>
                {item.status}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-white/5 blur-[100px] rounded-full pointer-events-none z-0" />
    </div>
  );
};


