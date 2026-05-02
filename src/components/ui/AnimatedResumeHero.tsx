import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const AnimatedResumeHero = ({ className }: { className?: string }) => {
  return (
    <div className={cn("relative perspective-1000", className)}>
      <motion.div
        initial={{ rotateX: 20, rotateY: -10, opacity: 0, y: 50 }}
        animate={{ rotateX: 15, rotateY: -5, opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="w-full aspect-[3/4] max-w-2xl bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-8"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
        <div className="space-y-6 relative z-10">
          <div className="h-8 w-1/3 bg-white/10 rounded" />
          <div className="space-y-2">
             <div className="h-4 w-full bg-white/5 rounded" />
             <div className="h-4 w-5/6 bg-white/5 rounded" />
          </div>
          <div className="pt-8 space-y-4">
             <div className="h-6 w-1/4 bg-white/10 rounded" />
             <div className="space-y-2">
                <div className="h-4 w-full bg-white/5 rounded" />
                <div className="h-4 w-3/4 bg-white/5 rounded" />
             </div>
          </div>
        </div>
        {/* Glowing border effect */}
        <div className="absolute inset-0 border border-blue-500/20 rounded-2xl animate-pulse pointer-events-none" />
      </motion.div>
    </div>
  );
};
