import { motion } from 'framer-motion';

export const TailorMockup = () => {
  return (
    <div className="w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-square xl:aspect-[4/3] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden relative flex items-center justify-center p-6">
      
      <div className="flex gap-4 w-full h-full max-h-[300px]">
        {/* Job Description Side */}
        <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3 overflow-hidden">
          <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Job Description</div>
          <div className="h-2 w-3/4 bg-zinc-800 rounded"></div>
          <div className="h-2 w-full bg-zinc-800 rounded"></div>
          <div className="h-2 w-5/6 bg-zinc-800 rounded"></div>
          <div className="mt-2 space-y-2">
            <span className="inline-block px-2 py-1 bg-white/10 text-white text-[10px] rounded mr-2 border border-white/20">React</span>
            <span className="inline-block px-2 py-1 bg-white/10 text-white text-[10px] rounded mr-2 border border-white/20">TypeScript</span>
            <span className="inline-block px-2 py-1 bg-zinc-800 text-zinc-400 text-[10px] rounded">GraphQL</span>
          </div>
        </div>

        {/* Sync Animation */}
        <div className="flex flex-col items-center justify-center gap-1">
          <motion.div animate={{ opacity: [0.3, 1, 0.3], x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0 }} className="w-4 h-0.5 bg-zinc-600"></motion.div>
          <motion.div animate={{ opacity: [0.3, 1, 0.3], x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }} className="w-4 h-0.5 bg-zinc-600"></motion.div>
          <motion.div animate={{ opacity: [0.3, 1, 0.3], x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }} className="w-4 h-0.5 bg-zinc-600"></motion.div>
        </div>

        {/* Tailored Resume Side */}
        <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3 overflow-hidden relative">
          <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Your Resume</div>
          
          <div className="border-l-2 border-white/40 pl-2 space-y-2 py-1">
            <div className="h-2 w-2/3 bg-zinc-700 rounded"></div>
            <motion.div 
               initial={{ backgroundColor: "rgba(39, 39, 42, 1)" }} // bg-zinc-800
               whileInView={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }} // bg-white/90
               transition={{ duration: 0.5, delay: 0.5 }}
               className="h-2 w-1/2 rounded"
            ></motion.div>
          </div>
          
          <div className="border-l-2 border-zinc-800 pl-2 space-y-2 py-1 mt-2">
            <div className="h-2 w-full bg-zinc-800 rounded"></div>
            <motion.div 
               initial={{ backgroundColor: "rgba(39, 39, 42, 1)" }}
               whileInView={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
               transition={{ duration: 0.5, delay: 0.8 }}
               className="h-2 w-3/4 rounded"
            ></motion.div>
          </div>
        </div>
      </div>

    </div>
  );
};
