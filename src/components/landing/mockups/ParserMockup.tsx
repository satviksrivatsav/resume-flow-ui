import { motion } from 'framer-motion';
import { FileUp, FileText } from 'lucide-react';

export const ParserMockup = () => {
  return (
    <div className="w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-square xl:aspect-[4/3] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden relative flex flex-col items-center justify-center p-6 gap-6">
      
      {/* Dropzone */}
      <motion.div 
        animate={{ borderStyle: ["dashed", "solid", "dashed"] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="w-full max-w-sm h-32 border-2 border-dashed border-zinc-700 rounded-xl bg-zinc-900/50 flex flex-col items-center justify-center gap-2 relative overflow-hidden"
      >
        <FileUp className="w-8 h-8 text-zinc-500" />
        <span className="text-xs text-zinc-400 font-medium">Drop old_resume.pdf here</span>
        
        {/* Scanning line */}
        <motion.div 
          animate={{ top: ["-10%", "110%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-8 bg-gradient-to-b from-transparent via-white/5 to-transparent w-full border-b border-white/20"
        />
      </motion.div>

      {/* Extracted Fields */}
      <div className="w-full max-w-sm space-y-3">
        <motion.div 
           initial={{ opacity: 0, y: 10 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.5 }}
           className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900 border border-zinc-800"
        >
          <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center"><FileText className="w-4 h-4 text-zinc-400"/></div>
          <div className="flex-1 space-y-1.5">
            <div className="flex justify-between items-center"><div className="h-2 w-16 bg-zinc-700 rounded"></div><div className="h-2 w-8 bg-zinc-800 rounded"></div></div>
            <div className="h-3 w-3/4 bg-zinc-300 rounded"></div>
          </div>
        </motion.div>
        
        <motion.div 
           initial={{ opacity: 0, y: 10 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.7 }}
           className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900 border border-zinc-800"
        >
          <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center"><FileText className="w-4 h-4 text-zinc-400"/></div>
          <div className="flex-1 space-y-1.5">
            <div className="flex justify-between items-center"><div className="h-2 w-20 bg-zinc-700 rounded"></div><div className="h-2 w-12 bg-zinc-800 rounded"></div></div>
            <div className="h-3 w-5/6 bg-zinc-300 rounded"></div>
          </div>
        </motion.div>
      </div>

    </div>
  );
};
