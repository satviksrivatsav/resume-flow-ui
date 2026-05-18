import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { useResumeStore } from '@/stores/resumeStore';

export const SaveStatus = () => {
  const saveStatus = useResumeStore((state) => state.saveStatus);
  const lastSaved = useResumeStore((state) => state.lastSaved);

  const getStatusColor = () => {
    switch (saveStatus) {
      case 'saving':
        return 'bg-primary';
      case 'error':
        return 'bg-destructive';
      case 'success':
      default:
        return 'bg-success';
    }
  };

  const getStatusPulseColor = () => {
    switch (saveStatus) {
      case 'saving':
        return 'bg-primary/50';
      case 'error':
        return 'bg-destructive/50';
      case 'success':
      default:
        return 'bg-success/50';
    }
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-background/40 border border-border/50 backdrop-blur-sm select-none">
      <div className="relative flex items-center justify-center w-2 h-2">
        <span className={cn('absolute inset-0 rounded-full transition-colors duration-300', getStatusColor())} />
        <span
          className={cn(
            'absolute inset-0 rounded-full animate-pulse transition-colors duration-300',
            getStatusPulseColor(),
          )}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.span
          key={saveStatus}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
          className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider"
        >
          {saveStatus === 'saving'
            ? 'Saving...'
            : saveStatus === 'error'
              ? 'Save Failed'
              : lastSaved
                ? `Saved ${format(lastSaved, 'HH:mm:ss')}`
                : 'Draft'}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};


