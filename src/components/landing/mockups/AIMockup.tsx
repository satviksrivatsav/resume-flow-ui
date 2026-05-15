import { animate, motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

export const AIMockup = () => {
  const fullText =
    'Spearheaded comprehensive marketing initiatives, driving a 45% year-over-year increase in overall sales revenue.';
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    const controls = animate(0, fullText.length, {
      duration: 3,
      ease: 'linear',
      repeat: Infinity,
      repeatDelay: 2,
      onUpdate: (latest) => {
        setDisplayText(fullText.slice(0, Math.round(latest)));
      },
    });
    return controls.stop;
  }, []);

  return (
    <div className="w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-square xl:aspect-[4/3] relative flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-md space-y-4 relative z-10 p-4">
        {/* Editor window */}
        <div className="w-full bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
          <div className="h-10 border-b border-zinc-800 flex items-center px-4 gap-2 bg-zinc-950/50">
            <div className="w-3 h-3 rounded-full bg-zinc-800"></div>
            <div className="w-3 h-3 rounded-full bg-zinc-800"></div>
            <div className="w-3 h-3 rounded-full bg-zinc-800"></div>
          </div>
          <div className="p-4 space-y-4">
            <div className="p-3 rounded bg-zinc-950 border border-zinc-800/50 text-xs text-zinc-500 font-mono">
              Did marketing stuff and increased sales a lot last year.
            </div>
            <div className="flex justify-center">
              <motion.button
                animate={{
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    '0 0 0 0 rgba(255,255,255,0)',
                    '0 0 15px 0 rgba(255,255,255,0.1)',
                    '0 0 0 0 rgba(255,255,255,0)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white text-black text-xs font-semibold"
              >
                <Sparkles className="w-3 h-3" /> Rewrite with AI
              </motion.button>
            </div>
            <div className="p-3 rounded bg-zinc-800 border border-zinc-700 text-xs text-zinc-200 font-mono relative min-h-[60px] leading-relaxed">
              {displayText}
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-1.5 h-3 bg-zinc-400 ml-0.5 align-middle"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-white/5 blur-[100px] rounded-full pointer-events-none z-0"></div>
    </div>
  );
};
