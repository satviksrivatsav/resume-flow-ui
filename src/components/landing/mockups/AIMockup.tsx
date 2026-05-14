import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export const AIMockup = () => {
  return (
    <div className="w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-square xl:aspect-[4/3] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden relative flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-4">
        {/* Editor window */}
        <div className="w-full bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-lg">
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
                animate={{ scale: [1, 1.05, 1], boxShadow: ["0 0 0 0 rgba(255,255,255,0)", "0 0 15px 0 rgba(255,255,255,0.1)", "0 0 0 0 rgba(255,255,255,0)"] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white text-black text-xs font-semibold"
              >
                <Sparkles className="w-3 h-3" /> Rewrite with AI
              </motion.button>
            </div>
            <div className="p-3 rounded bg-zinc-800 border border-zinc-700 text-xs text-zinc-200 font-mono relative overflow-hidden">
               <motion.div 
                 initial={{ width: "0%" }}
                 whileInView={{ width: "100%" }}
                 viewport={{ once: false }}
                 transition={{ duration: 1.5, ease: "linear", delay: 0.5 }}
                 className="absolute inset-0 bg-zinc-950 z-10 origin-left"
                 style={{ transformOrigin: 'right' }}
               />
               Spearheaded comprehensive marketing initiatives, driving a 45% year-over-year increase in overall sales revenue.
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-zinc-800/20 blur-[100px] rounded-full pointer-events-none -z-10"></div>
    </div>
  );
};
