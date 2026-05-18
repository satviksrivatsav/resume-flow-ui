import { animate, AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export const ATSMockup = () => {
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<'start' | 'animating' | 'hold'>('start');

  useEffect(() => {
    let isMounted = true;

    const runCycle = async () => {
      while (isMounted) {
        // Step 1: Start/Reset
        setPhase('start');
        setScore(0);
        await new Promise((r) => setTimeout(r, 500));

        // Step 2: Animate (3s)
        if (!isMounted) break;
        setPhase('animating');
        const controls = animate(0, 85, {
          duration: 3,
          ease: 'easeInOut',
          onUpdate: (latest) => setScore(Math.round(latest)),
        });
        await new Promise((r) => setTimeout(r, 3000));

        // Step 3: Hold (1.5s)
        if (!isMounted) break;
        setPhase('hold');
        await new Promise((r) => setTimeout(r, 1500));
      }
    };

    runCycle();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-square xl:aspect-[4/3] relative flex flex-col items-center justify-center overflow-hidden p-4 gap-8">
      <div className="relative z-10 w-full flex flex-col items-center justify-center gap-8">
        {/* Score Ring */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-zinc-800"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray="251.2"
              animate={{
                strokeDashoffset: phase === 'start' ? 251.2 : 251.2 * (1 - 0.85),
                stroke: phase === 'start' ? '#ef4444' : '#10b981',
              }}
              transition={{
                duration: phase === 'animating' ? 3 : phase === 'start' ? 0.3 : 0,
                ease: 'easeInOut',
              }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              animate={{
                opacity: phase === 'start' ? 0 : 1,
                color: phase === 'animating' || phase === 'hold' ? '#10b981' : '#ef4444',
              }}
              transition={{ duration: phase === 'animating' ? 3 : 0.3 }}
              className="flex items-center justify-center"
            >
              <span className="text-3xl font-black tracking-tighter">{score}</span>
              <span className="text-sm font-bold ml-0.5 opacity-70">%</span>
            </motion.div>
          </div>
        </div>

        {/* Checklist */}
        <div className="w-full max-w-xs space-y-2">
          {[
            { label: 'Keywords Match', status: 'Needs Work', passed: false },
            { label: 'Formatting', status: 'Passed', passed: true },
            { label: 'Action Verbs', status: 'Passed', passed: true },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              animate={{
                opacity: phase === 'start' ? 0.3 : 1,
                borderColor: phase === 'hold' && item.passed ? '#10b981' : '#27272a',
              }}
              transition={{
                duration: 0.5,
                delay: phase === 'animating' ? idx * 0.2 : 0,
              }}
              className="flex items-center justify-between p-3 rounded-lg bg-zinc-900 border border-zinc-800 shadow-lg"
            >
              <span className="text-sm font-medium text-white">{item.label}</span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${item.passed && phase !== 'start' ? 'bg-success text-white' : 'bg-zinc-800 text-zinc-400'}`}
              >
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

