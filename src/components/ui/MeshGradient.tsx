import React from "react";
import { cn } from "@/lib/utils";

export const MeshGradient = ({ className }: { className?: string }) => {
  return (
    <div className={cn("absolute inset-0 z-0 overflow-hidden bg-black", className)}>
      <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-blue-900/30 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-900/20 blur-[150px] animate-pulse [animation-delay:2s]" />
      <div className="absolute top-[30%] right-[20%] w-[40%] h-[40%] rounded-full bg-purple-900/20 blur-[100px] animate-pulse [animation-delay:4s]" />
    </div>
  );
};
