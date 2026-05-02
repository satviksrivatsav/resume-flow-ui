import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Custom hook to sequence typing across multiple text blocks
const useSequentialTyping = (texts: string[], delayPerChar = 30, delayBetweenBlocks = 500, loopDelay = 3000) => {
  const [displayedTexts, setDisplayedTexts] = useState<string[]>(texts.map(() => ""));
  const [currentBlock, setCurrentBlock] = useState(0);

  useEffect(() => {
    if (currentBlock >= texts.length) {
      const resetTimeout = setTimeout(() => {
        setDisplayedTexts(texts.map(() => ""));
        setCurrentBlock(0);
      }, loopDelay);
      return () => clearTimeout(resetTimeout);
    }

    const textToType = texts[currentBlock];
    let i = 0;
    
    const interval = setInterval(() => {
      setDisplayedTexts(prev => {
        const next = [...prev];
        next[currentBlock] = textToType.slice(0, i);
        return next;
      });
      i++;
      
      if (i > textToType.length) {
        clearInterval(interval);
        setTimeout(() => {
          setCurrentBlock(c => c + 1);
        }, delayBetweenBlocks);
      }
    }, delayPerChar);

    return () => clearInterval(interval);
  }, [currentBlock, texts, delayPerChar, delayBetweenBlocks, loopDelay]);

  return { displayedTexts, currentBlock };
};

export const AnimatedResumeHero = ({ className }: { className?: string }) => {
  const resumeTexts = [
    "Johnathan Doe",
    "Senior Product Designer",
    "Led the redesign of the core web application, increasing user engagement by 45%.",
    "Developed a comprehensive design system utilized by 5 cross-functional teams.",
    "Pioneered accessible design standards, ensuring WCAG 2.1 AA compliance.",
    "Interaction Design",
    "Framer Motion",
    "React.js"
  ];
  
  const { displayedTexts, currentBlock } = useSequentialTyping(React.useMemo(() => resumeTexts, []), 20, 200, 3000);

  const Cursor = ({ active }: { active: boolean }) => (
    <motion.span
      animate={{ opacity: [1, 0] }}
      transition={{ duration: 0.8, repeat: Infinity }}
      className={cn("inline-block w-0.5 h-[1em] bg-blue-500 ml-0.5 translate-y-0.5", active ? "visible" : "hidden")}
    />
  );

  return (
    <div className={cn("relative perspective-1000", className)}>
      <motion.div
        initial={{ rotateX: 20, rotateY: -10, opacity: 0, y: 50 }}
        animate={{ rotateX: 15, rotateY: -5, opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="w-full aspect-[3/4] max-w-2xl bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-6 md:p-10"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
        
        <div className="space-y-6 md:space-y-8 relative z-10 text-left">
          <div className="space-y-1">
            <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight h-8">
              {displayedTexts[0]}<Cursor active={currentBlock === 0} />
            </h3>
            <p className="text-blue-400 font-medium text-base md:text-lg h-6">
              {displayedTexts[1]}<Cursor active={currentBlock === 1} />
            </p>
          </div>

          <div className="space-y-4">
             <div className="h-px w-full bg-white/10" />
             <div className="text-zinc-300 text-xs md:text-sm font-mono leading-relaxed min-h-[40px]">
                {displayedTexts[2]}<Cursor active={currentBlock === 2} />
             </div>
          </div>

          <div className="pt-2 md:pt-4 space-y-4 md:space-y-6">
             <div className="text-[10px] md:text-sm font-semibold text-white/40 uppercase tracking-widest">Experience</div>
             
             <div className="text-zinc-300 text-xs md:text-sm font-mono min-h-[20px]">
                {displayedTexts[3]}<Cursor active={currentBlock === 3} />
             </div>

             <div className="text-zinc-300 text-xs md:text-sm font-mono min-h-[20px] opacity-70">
                {displayedTexts[4]}<Cursor active={currentBlock === 4} />
             </div>
          </div>
          
          <div className="pt-2 md:pt-4 space-y-2">
             <div className="text-[10px] md:text-sm font-semibold text-white/40 uppercase tracking-widest">Skills</div>
             <div className="flex gap-2 flex-wrap text-xs md:text-sm font-mono text-zinc-400 min-h-[28px]">
               <span className="bg-white/5 px-2 py-1 rounded inline-block">{displayedTexts[5]}<Cursor active={currentBlock === 5} /></span>
               <span className="bg-white/5 px-2 py-1 rounded inline-block">{displayedTexts[6]}<Cursor active={currentBlock === 6} /></span>
               <span className="bg-white/5 px-2 py-1 rounded inline-block">{displayedTexts[7]}<Cursor active={currentBlock === 7} /></span>
             </div>
          </div>
        </div>

        {/* Glowing border effect */}
        <div className="absolute inset-0 border border-blue-500/20 rounded-2xl animate-pulse pointer-events-none" />
      </motion.div>
    </div>
  );
};
