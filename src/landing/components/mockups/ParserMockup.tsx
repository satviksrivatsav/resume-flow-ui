import { motion } from 'framer-motion';
import { Database, FileText } from 'lucide-react';

export const ParserMockup = () => {
  return (
    <div className="w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-square xl:aspect-[4/3] relative flex items-center justify-center overflow-hidden p-4">
      <div className="flex gap-8 w-full max-w-md items-center relative z-10">
        {/* Left Side: Document with Scanner */}
        <div className="flex-1 relative">
          <div className="aspect-[1/1.414] w-full bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-4 relative overflow-hidden shadow-xl">
            <div className="h-2 w-1/3 bg-zinc-800 rounded" />
            <div className="space-y-2">
              <div className="h-1.5 w-full bg-zinc-800/50 rounded" />
              <div className="h-1.5 w-full bg-zinc-800/50 rounded" />
              <div className="h-1.5 w-2/3 bg-zinc-800/50 rounded" />
            </div>
            <div className="h-2 w-1/4 bg-zinc-800 rounded" />
            <div className="space-y-2">
              <div className="h-1.5 w-full bg-zinc-800/50 rounded" />
              <div className="h-1.5 w-5/6 bg-zinc-800/50 rounded" />
            </div>

            {/* Scanning line */}
            <motion.div
              animate={{ top: ['-10%', '110%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="absolute left-0 right-0 h-10 bg-gradient-to-b from-transparent via-white/5 to-transparent w-full border-b border-white/10 z-10"
            />
          </div>
          <div className="absolute -bottom-4 -left-4 p-2 rounded-lg bg-zinc-950 border border-zinc-800 shadow-xl">
            <FileText className="w-5 h-5 text-zinc-400" />
          </div>
        </div>

        {/* Middle: Transfer arrows */}
        <div className="flex flex-col gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.2, 1, 0.2], x: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              className="w-4 h-0.5 bg-zinc-700"
            />
          ))}
        </div>

        {/* Right Side: Extracted Data */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-4 h-4 text-zinc-500" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Structured Data
            </span>
          </div>

          {[
            { label: 'Experience', value: 'Software Engineer at TechCorp', delay: 0.5 },
            { label: 'Education', value: 'BS in Computer Science', delay: 1.2 },
            { label: 'Skills', value: 'React, Node.js, Python', delay: 2.0 },
          ].map((field, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: [0, 1, 1, 0], x: [20, 0, 0, -10] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: field.delay,
                times: [0, 0.1, 0.9, 1],
              }}
              className="p-2.5 rounded bg-zinc-900 border border-zinc-800 space-y-1 shadow-lg"
            >
              <div className="h-1.5 w-12 bg-zinc-700 rounded"></div>
              <div className="text-[10px] text-zinc-300 font-mono truncate">{field.value}</div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-white/5 blur-[100px] rounded-full pointer-events-none z-0" />
    </div>
  );
};
