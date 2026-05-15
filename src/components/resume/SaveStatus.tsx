import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { useResumeStore } from '@/stores/resumeStore';
import { cn } from '@/lib/utils';

export const SaveStatus = () => {
  const isSaving = useResumeStore((state) => state.isSaving);
  const lastSaved = useResumeStore((state) => state.lastSaved);

  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-background/40 border border-border/50 backdrop-blur-sm select-none">
      <div className="relative flex items-center justify-center w-2 h-2">
        <span
          className={cn(
            "absolute inset-0 rounded-full",
            isSaving ? "bg-blue-500" : "bg-green-500"
          )}
        />
        <span
          className={cn(
            "absolute inset-0 rounded-full animate-pulse",
            isSaving ? "bg-blue-500/50" : "bg-green-500/50"
          )}
        />
      </div>
      
      <AnimatePresence mode="wait">
        <motion.span
          key={isSaving ? "saving" : "saved"}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
          className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider"
        >
          {isSaving ? (
            "Saving..."
          ) : lastSaved ? (
            `Saved ${format(lastSaved, 'HH:mm:ss')}`
          ) : (
            "Draft"
          )}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};
