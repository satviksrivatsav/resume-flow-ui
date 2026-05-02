import React from "react";
import { cn } from "@/lib/utils";

export const MeshGradient = ({ className }: { className?: string }) => {
  return (
    <div className={cn("absolute inset-0 z-0 overflow-hidden", className)}>
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] animate-pulse [animation-delay:2s]" />
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-indigo-600/10 blur-[100px] animate-pulse [animation-delay:4s]" />
    </div>
  );
};
