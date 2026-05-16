import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Info } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

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
  rightElement?: React.ReactNode;
  isEditable?: boolean;
  onNewTextChange?: (text: string) => void;
  infoTip?: string;
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
  rightElement,
  isEditable = false,
  onNewTextChange,
  infoTip,
}: AIDiffViewerProps) {
  const [rejectHovered, setRejectHovered] = useState(false);
  const [acceptHovered, setAcceptHovered] = useState(false);
  const [localText, setLocalText] = useState(typeof newText === 'string' ? newText : '');
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync local text and reset editing state when section changes
  // CRITICAL: We only sync if NOT editing to prevent keystroke feedback loops
  useEffect(() => {
    if (typeof newText === 'string' && !isEditing) {
      setLocalText(newText);
    }
  }, [newText, isEditing]);

  // Handle auto-resize
  useEffect(() => {
    if (isEditable && isEditing && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [localText, isEditable, isEditing]);

  return (
    <div className="flex flex-col h-full bg-card/30 backdrop-blur-md rounded-[2.5rem] border border-primary/10 overflow-hidden shadow-sm transition-all duration-300">
      {/* Header with Title */}
      <div className="p-8 border-b border-primary/10 flex items-center justify-between bg-gradient-to-r from-primary/5 to-transparent">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <h3 className="text-2xl font-bold tracking-tight">{title || 'Review Changes'}</h3>
          </div>
          {infoTip && (
            <div className="flex items-center gap-1.5 opacity-60">
              <Info className="w-3.5 h-3.5 text-muted-foreground" />
              <p className="text-xs text-muted-foreground font-medium italic">
                {infoTip}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {rightElement}

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
                      ? 'border-destructive bg-destructive/10'
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
                      ? 'bg-green-600 hover:bg-green-700 text-white border-0'
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
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-0 divide-x divide-primary/10">
        {/* Original Text */}
        <div className="flex flex-col relative group/original min-h-[300px]">
          <div className="absolute top-6 left-8 flex items-center gap-2 pointer-events-none opacity-40 group-hover/original:opacity-100 transition-opacity">
            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Original
            </span>
          </div>
          <div className="flex-1 p-8 pt-16 text-[14px] leading-[1.8] text-muted-foreground/80 whitespace-pre-wrap">
            {originalText || <span className="italic opacity-50">No original content</span>}
          </div>
        </div>

        {/* Tailored Text */}
        <div className="flex flex-col relative bg-primary/[0.02] group/tailored min-h-[300px]">
          <div className="absolute top-6 left-8 right-8 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-2 opacity-40 group-hover/tailored:opacity-100 transition-opacity">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                Tailored
              </span>
            </div>
            {isEditable && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="pointer-events-auto text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40 hover:text-primary transition-colors cursor-pointer"
              >
                Edit
              </button>
            )}
          </div>
          <div className="flex-1 p-8 pt-16 text-[14px] leading-[1.8] text-foreground font-medium whitespace-pre-wrap">
            {isEditable && isEditing ? (
              <div className="flex flex-col gap-2">
                <textarea
                  ref={textareaRef}
                  autoFocus
                  className="w-full min-h-[200px] bg-transparent border-none focus:ring-0 resize-none outline-none p-0 custom-scrollbar scrollbar-hide text-[14px] leading-[1.8] font-medium overflow-hidden"
                  value={localText}
                  onChange={(e) => {
                    setLocalText(e.target.value);
                    onNewTextChange?.(e.target.value);
                  }}
                  placeholder="Type to edit the tailored version..."
                  spellCheck={false}
                />
              </div>
            ) : (
              newText || <span className="italic opacity-50">No content generated</span>
            )}
          </div>
        </div>
      </div>

      {footer && (
        <div className="p-8 border-t border-primary/10 bg-card/50 flex flex-col gap-3">
          {footer}
        </div>
      )}
    </div>
  );
}
