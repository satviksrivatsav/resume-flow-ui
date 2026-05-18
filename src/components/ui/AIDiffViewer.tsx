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
  isDiffMode?: boolean;
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
  isDiffMode = true,
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
      <div className="px-8 py-5 border-b border-primary/10 flex items-center justify-between bg-gradient-to-r from-primary/5 to-transparent">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <h3 className="text-xl font-bold tracking-tight">{title || 'Review Changes'}</h3>
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
                  variant="destructive"
                  size="lg"
                  onClick={onReject}
                  className="gap-2 rounded-full px-6 h-12 transition-all duration-300 bg-destructive hover:bg-destructive/90 text-white border-none"
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
                  className="gap-2 rounded-full px-6 h-12 transition-all duration-300 bg-success hover:bg-success/90 text-white border-none"
                >
                  <DrawableCheck draw={acceptHovered} />
                  Accept
                </Button>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      <div className={cn(
        "flex-1 grid grid-cols-1 h-[500px] md:h-[600px] max-h-[60vh] overflow-hidden",
        isDiffMode ? "lg:grid-cols-2 divide-x divide-primary/10" : "lg:grid-cols-1"
      )}>

        {/* Original Text */}
        {isDiffMode && (
          <div className="flex flex-col relative group/original overflow-y-auto custom-scrollbar min-h-0">
            <div className="p-6 pb-0 flex flex-col items-center gap-1 opacity-40 group-hover/original:opacity-100 transition-opacity">
              <span className="text-[12px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
                Original
              </span>
            </div>
            <div className={cn(
              "flex-1 p-6 pt-4 text-[14px] leading-[1.8] text-muted-foreground/80",
              typeof originalText === 'string' && "whitespace-pre-wrap"
            )}>
              {originalText || <span className="italic opacity-50">No original content</span>}
            </div>
          </div>
        )}


        {/* Tailored Text */}
        <div className="flex flex-col relative bg-primary/[0.02] group/tailored overflow-y-auto custom-scrollbar min-h-0">
          <div className="p-6 pb-0 flex flex-col items-center gap-1 opacity-40 group-hover/tailored:opacity-100 transition-opacity">
            <div className="flex items-center justify-between w-full">
              <div /> {/* Spacer for centering */}
              <span className="text-[12px] font-bold uppercase tracking-[0.3em] text-primary">
                {isDiffMode ? 'Refined' : 'Proposed'}
              </span>


              <div className="min-w-[40px] flex justify-end">
                {isEditable && !isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="pointer-events-auto text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40 hover:text-primary transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className={cn(
            "flex-1 p-6 pt-4 text-[14px] leading-[1.8] text-foreground font-normal",
            typeof newText === 'string' && "whitespace-pre-wrap"
          )}>


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
        <div className="px-8 py-5 border-t border-primary/10 bg-card/50 flex flex-col gap-3">
          {footer}
        </div>
      )}
    </div>
  );
}


