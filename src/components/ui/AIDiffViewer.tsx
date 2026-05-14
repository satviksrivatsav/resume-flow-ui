import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ── Hand-drawn X icon ────────────────────────────────────────────────────────
export function DrawableX({ draw }: { draw: boolean }) {
  const line = (delay: number) => ({
    animate: draw
      ? { pathLength: [0, 1], transition: { duration: 0.2, ease: 'easeOut' as const, delay } }
      : { pathLength: 1 },
  });
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <motion.line x1="18" y1="6" x2="6" y2="18" initial={{ pathLength: 1 }} {...line(0)} />
      <motion.line x1="6" y1="6" x2="18" y2="18" initial={{ pathLength: 1 }} {...line(0.18)} />
    </svg>
  );
}

// ── Hand-drawn checkmark icon ────────────────────────────────────────────────
export function DrawableCheck({ draw }: { draw: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <motion.polyline
        points="4 12 9 17 20 6"
        initial={{ pathLength: 1 }}
        animate={
          draw
            ? { pathLength: [0, 1], transition: { duration: 0.3, ease: 'easeOut' } }
            : { pathLength: 1 }
        }
      />
    </svg>
  );
}

interface AIDiffViewerProps {
  title?: string;
  description?: string;
  originalText: string | React.ReactNode;
  newText: string | React.ReactNode;
  onAccept?: () => void;
  onReject?: () => void;
  decision?: 'accept' | 'reject';
  showActions?: boolean;
  footer?: React.ReactNode;
}

export function AIDiffViewer({
  title,
  description,
  originalText,
  newText,
  onAccept,
  onReject,
  decision,
  showActions = true,
  footer,
}: AIDiffViewerProps) {
  const [rejectHovered, setRejectHovered] = useState(false);
  const [acceptHovered, setAcceptHovered] = useState(false);

  return (
    <div className="flex flex-col h-full bg-card/30 backdrop-blur-md rounded-[2.5rem] border border-primary/10 overflow-hidden shadow-2xl shadow-primary/5">
      {/* Header with Title */}
      <div className="p-8 border-b border-primary/10 flex items-center justify-between bg-gradient-to-r from-primary/5 to-transparent">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <h3 className="text-2xl font-bold tracking-tight">{title || 'Review Changes'}</h3>
          </div>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>

        {showActions && (
          <div className="flex gap-3">
            <motion.div
              whileTap={{ scale: 0.95 }}
              onHoverStart={() => setRejectHovered(true)}
              onHoverEnd={() => setRejectHovered(false)}
            >
              <Button
                variant={decision === 'reject' ? 'destructive' : 'outline'}
                size="lg"
                onClick={onReject}
                className={cn(
                  'gap-2 rounded-full px-6 h-12 transition-all duration-300',
                  decision === 'reject'
                    ? 'shadow-lg shadow-destructive/20 border-destructive'
                    : 'border-destructive/40 text-destructive hover:bg-destructive/10 hover:border-destructive',
                )}
              >
                <DrawableX draw={rejectHovered} />
                Reject
              </Button>
            </motion.div>

            <motion.div
              whileTap={{ scale: 0.95 }}
              onHoverStart={() => setAcceptHovered(true)}
              onHoverEnd={() => setAcceptHovered(false)}
            >
              <Button
                size="lg"
                onClick={onAccept}
                className={cn(
                  'gap-2 rounded-full px-6 h-12 transition-all duration-300',
                  decision === 'accept'
                    ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/20 border-0'
                    : 'bg-green-600/10 text-green-600 hover:bg-green-600 hover:text-white border-0',
                )}
              >
                <DrawableCheck draw={acceptHovered} />
                Accept
              </Button>
            </motion.div>
          </div>
        )}
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-0 divide-x divide-primary/10">
        {/* Original Text */}
        <div className="flex flex-col min-h-0">
          <div className="px-8 py-4 bg-muted/20 border-b border-primary/5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Original Version
            </span>
          </div>
          <div className="flex-1 p-8 overflow-y-auto custom-scrollbar text-[13px] leading-relaxed text-muted-foreground whitespace-pre-wrap">
            {originalText || <span className="italic opacity-50">No original content</span>}
          </div>
        </div>

        {/* Tailored Text */}
        <div className="flex flex-col min-h-0 bg-primary/[0.01]">
          <div className="px-8 py-4 bg-primary/5 border-b border-primary/10">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
              Tailored Version
            </span>
          </div>
          <div className="flex-1 p-8 overflow-y-auto custom-scrollbar text-[13px] leading-relaxed text-foreground font-medium whitespace-pre-wrap">
            {newText || <span className="italic opacity-50">No content generated</span>}
          </div>
        </div>
      </div>

      {footer && <div className="p-6 border-t border-primary/10 bg-card/50">{footer}</div>}
    </div>
  );
}
