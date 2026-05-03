import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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
  const { scrollY } = useScroll();

  // Transform rotation from tilted (15, -5) to flat (0, 0)
  // Straightens over the first 400px of scrolling
  const rotateX = useTransform(scrollY, [0, 400], [15, 0]);
  const rotateY = useTransform(scrollY, [0, 400], [-5, 0]);
  const scale = useTransform(scrollY, [0, 400], [1, 1.02]);
  const opacity = useTransform(scrollY, [0, 600, 1000], [1, 1, 0.4]);


  const resumeTexts = React.useMemo(() => [
    "Dr. Alan Turing",
    "Senior Machine Learning Engineer",
    "AI researcher and engineer specializing in Large Language Models, distributed training, and scalable inference. Proven track record of deploying robust ML pipelines that serve millions of daily requests with sub-50ms latency.",
    "Architected and trained a custom 13B parameter MoE model for domain-specific reasoning, outperforming baseline models by 24% on internal benchmarks.",
    "Engineered a distributed data processing pipeline using Apache Spark, reducing dataset preparation time from 4 days to 6 hours across a 50-node cluster.",
    "Optimized model inference serving using TensorRT and vLLM, cutting GPU memory usage by 40% and increasing throughput by 3x.",
    "PyTorch",
    "TensorFlow",
    "CUDA",
    "Kubernetes",
    "LLMs",
    "Python",
    "Go"
  ], []);
  
  // Faster typing to handle more content
  const { displayedTexts, currentBlock } = useSequentialTyping(resumeTexts, 12, 100, 4000);

  const Cursor = ({ active }: { active: boolean }) => (
    <motion.span
      animate={{ opacity: [1, 0] }}
      transition={{ duration: 0.8, repeat: Infinity }}
      className={cn("inline-block w-0.5 h-[1em] bg-white ml-0.5 translate-y-0.5", active ? "visible" : "hidden")}
    />
  );

  return (
    <div className={cn("relative perspective-1000", className)}>
      <motion.div
        style={{ 
          rotateX, 
          rotateY, 
          scale,
          opacity,
          transformStyle: "preserve-3d" 
        }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="w-full aspect-[3/4] max-w-2xl bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-6 md:p-10"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
        
        <div className="space-y-6 md:space-y-8 relative z-10 text-left">
          <div className="space-y-1">
            <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight h-8">
              {displayedTexts[0]}<Cursor active={currentBlock === 0} />
            </h3>
            <p className="text-zinc-200 font-medium text-base md:text-lg h-6">
              {displayedTexts[1]}<Cursor active={currentBlock === 1} />
            </p>
          </div>

          <div className="space-y-4">
             <div className="text-[10px] md:text-sm font-semibold text-white/40 uppercase tracking-widest">About</div>
             <div className="text-zinc-300 text-xs md:text-sm font-mono leading-relaxed min-h-[40px]">
                {displayedTexts[2]}<Cursor active={currentBlock === 2} />
             </div>
          </div>

          <div className="space-y-4">
             <div className="h-px w-full bg-white/10" />
             <div className="text-[10px] md:text-sm font-semibold text-white/40 uppercase tracking-widest">Experience</div>
             
             <div className="space-y-4">
               <div className="text-zinc-300 text-xs md:text-sm font-mono min-h-[36px]">
                  {displayedTexts[3]}<Cursor active={currentBlock === 3} />
               </div>

               <div className="text-zinc-300 text-xs md:text-sm font-mono min-h-[36px] opacity-90">
                  {displayedTexts[4]}<Cursor active={currentBlock === 4} />
               </div>

               <div className="text-zinc-300 text-xs md:text-sm font-mono min-h-[36px] opacity-80">
                  {displayedTexts[5]}<Cursor active={currentBlock === 5} />
               </div>
             </div>
          </div>
          
          <div className="pt-2 space-y-3">
             <div className="text-[10px] md:text-sm font-semibold text-white/40 uppercase tracking-widest">Expertise</div>
             <div className="flex gap-2 flex-wrap text-xs md:text-sm font-mono text-zinc-400">
               <span className="bg-white/5 px-2 py-1 rounded inline-block">{displayedTexts[6]}<Cursor active={currentBlock === 6} /></span>
               <span className="bg-white/5 px-2 py-1 rounded inline-block">{displayedTexts[7]}<Cursor active={currentBlock === 7} /></span>
               <span className="bg-white/5 px-2 py-1 rounded inline-block">{displayedTexts[8]}<Cursor active={currentBlock === 8} /></span>
               <span className="bg-white/5 px-2 py-1 rounded inline-block">{displayedTexts[9]}<Cursor active={currentBlock === 9} /></span>
               <span className="bg-white/5 px-2 py-1 rounded inline-block">{displayedTexts[10]}<Cursor active={currentBlock === 10} /></span>
               <span className="bg-white/5 px-2 py-1 rounded inline-block">{displayedTexts[11]}<Cursor active={currentBlock === 11} /></span>
               <span className="bg-white/5 px-2 py-1 rounded inline-block">{displayedTexts[12]}<Cursor active={currentBlock === 12} /></span>
             </div>
          </div>
        </div>

        {/* Glowing border effect */}
        <div className="absolute inset-0 border border-white/20 rounded-2xl animate-pulse pointer-events-none" />
      </motion.div>
    </div>
  );
};
