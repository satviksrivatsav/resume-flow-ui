import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export const TailorMockup = () => {
  const keywords = ['React', 'TypeScript', 'Node.js', 'GraphQL', 'Tailwind'];
  // phases: 'scanning', 'revealed'
  const [phase, setPhase] = useState('scanning');

  useEffect(() => {
    let isMounted = true;
    const runCycle = async () => {
      if (!isMounted) return;
      setPhase('scanning');
      await new Promise((r) => setTimeout(r, 3000));

      if (!isMounted) return;
      setPhase('revealed');
      await new Promise((r) => setTimeout(r, 4000));

      if (isMounted) runCycle();
    };

    runCycle();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-square xl:aspect-[4/3] relative flex items-center justify-center overflow-hidden p-4">
      <div className="w-full max-w-2xl flex gap-6 relative z-10 items-stretch min-h-[300px]">
        {/* Job Description Panel */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-4 relative shadow-xl overflow-hidden flex-1">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-2">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Job Description
            </span>
            <div className="h-1.5 w-12 bg-zinc-800 rounded"></div>
          </div>

          <div className="space-y-3">
            <div className="h-2 w-full bg-zinc-800/50 rounded"></div>
            <div className="h-2 w-5/6 bg-zinc-800/50 rounded"></div>
            <div className="flex flex-wrap gap-2 py-2">
              {keywords.map((kw, i) => (
                <motion.span
                  key={kw}
                  animate={
                    phase === 'scanning'
                      ? {
                          color: [
                            'rgba(161, 161, 170, 1)',
                            'rgba(255, 255, 255, 1)',
                            'rgba(161, 161, 170, 1)',
                          ],
                          borderColor: [
                            'rgba(63, 63, 70, 1)',
                            'rgba(255, 255, 255, 0.5)',
                            'rgba(63, 63, 70, 1)',
                          ],
                          backgroundColor: [
                            'rgba(39, 39, 42, 0)',
                            'rgba(255, 255, 255, 0.05)',
                            'rgba(39, 39, 42, 0)',
                          ],
                        }
                      : { color: 'rgba(161, 161, 170, 1)' }
                  }
                  transition={{
                    duration: 3,
                    repeat: phase === 'scanning' ? Infinity : 0,
                    delay: i * 0.2,
                  }}
                  className="px-2 py-1 rounded border border-zinc-700 text-[9px] font-medium transition-colors"
                >
                  {kw}
                </motion.span>
              ))}
            </div>
            <div className="h-2 w-full bg-zinc-800/50 rounded"></div>
            <div className="h-2 w-2/3 bg-zinc-800/50 rounded"></div>
          </div>

          {/* Scanning Line */}
          <AnimatePresence>
            {phase === 'scanning' && (
              <motion.div
                initial={{ top: '-10%' }}
                animate={{ top: '110%' }}
                exit={{ opacity: 0, transition: { duration: 0 } }}
                transition={{ duration: 2.5, ease: 'linear' }}
                className="absolute left-0 right-0 h-10 bg-gradient-to-b from-transparent via-white/5 to-transparent w-full border-b border-white/10 z-20"
              />
            )}
          </AnimatePresence>
        </div>

        {/* Tailored Resume Panel Slot (Fixed Width Container) */}
        <div className="flex-1 relative">
          <AnimatePresence>
            {phase === 'revealed' && (
              <motion.div
                key="resume-panel"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, transition: { duration: 0 } }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="absolute inset-0 bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-4 shadow-2xl overflow-hidden"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-[10px] font-bold text-white uppercase tracking-wider">
                      Tailored
                    </div>
                    <div className="text-[10px] font-bold text-white uppercase tracking-wider">
                      Resume
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <div className="w-16 h-2 bg-zinc-800/80 rounded-full" />
                    <div className="w-10 h-2 bg-zinc-800/50 rounded-full" />
                  </div>
                </div>

                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-8 bg-zinc-800 rounded-full" />
                        <div className="h-2 w-16 bg-zinc-800 rounded-full" />
                      </div>
                      <div className="h-1.5 w-full bg-zinc-200/20 rounded-full" />
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-4 border-t border-zinc-800/50">
                  <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-success/10 border border-success/20 text-success">
                    <CheckCircle2 className="w-4 h-4" />
                    <div className="flex flex-col items-start leading-none">
                      <span className="text-[11px] font-black uppercase tracking-tighter">98%</span>
                      <span className="text-[8px] font-bold uppercase tracking-widest">Match</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-white/5 blur-[100px] rounded-full pointer-events-none z-0" />
    </div>
  );
};
