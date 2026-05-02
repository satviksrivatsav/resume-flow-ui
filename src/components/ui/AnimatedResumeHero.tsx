import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const TypeWriter = ({ text, delay = 50 }: { text: string; delay?: number }) => {
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, delay);
    return () => clearInterval(interval);
  }, [text, delay]);

  return (
    <span>
      {displayedText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="inline-block w-0.5 h-[1em] bg-blue-500 ml-0.5 translate-y-0.5"
      />
    </span>
  );
};

export const AnimatedResumeHero = ({ className }: { className?: string }) => {
  return (
    <div className={cn("relative perspective-1000", className)}>
      <motion.div
        initial={{ rotateX: 20, rotateY: -10, opacity: 0, y: 50 }}
        animate={{ rotateX: 15, rotateY: -5, opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="w-full aspect-[3/4] max-w-2xl bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-10"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
        
        <div className="space-y-8 relative z-10">
          <div className="space-y-3">
            <h3 className="text-3xl font-bold text-white tracking-tight">
              <TypeWriter text="Johnathan Doe" delay={100} />
            </h3>
            <p className="text-blue-400 font-medium text-lg">
              <TypeWriter text="Senior Product Designer" delay={70} />
            </p>
          </div>

          <div className="space-y-4">
             <div className="h-px w-full bg-white/10" />
             <div className="space-y-2">
                <div className="h-3 w-full bg-white/5 rounded-full" />
                <div className="h-3 w-5/6 bg-white/5 rounded-full" />
                <div className="h-3 w-4/6 bg-white/5 rounded-full" />
             </div>
          </div>

          <div className="pt-4 space-y-6">
             <div className="text-sm font-semibold text-white/40 uppercase tracking-widest">Experience</div>
             
             <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div className="h-5 w-1/3 bg-white/10 rounded" />
                  <div className="h-3 w-1/6 bg-white/5 rounded" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-full bg-white/5 rounded-full" />
                  <div className="h-3 w-11/12 bg-white/5 rounded-full" />
                </div>
             </div>

             <div className="space-y-4 opacity-50">
                <div className="flex justify-between items-end">
                  <div className="h-5 w-1/4 bg-white/10 rounded" />
                  <div className="h-3 w-1/6 bg-white/5 rounded" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-full bg-white/5 rounded-full" />
                  <div className="h-3 w-4/5 bg-white/5 rounded-full" />
                </div>
             </div>
          </div>
        </div>

        {/* Glowing border effect */}
        <div className="absolute inset-0 border border-blue-500/20 rounded-2xl animate-pulse pointer-events-none" />
      </motion.div>
    </div>
  );
};
