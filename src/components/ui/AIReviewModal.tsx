import { useState } from 'react';
import { Sparkles, Timer, AlertTriangle, ServerCrash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useAIWriterStore } from '@/stores/aiWriterStore';
import { motion } from 'framer-motion';

// ── Portal loading animation ─────────────────────────────────────────────────
// Three Sparkles icons stream right→left in a staggered loop, like Samsung AI.
function PortalLoader() {
    return (
        <div className="flex flex-col items-center gap-5">
            <div className="relative w-28 h-10 overflow-hidden flex items-center justify-center">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className="absolute"
                        animate={{
                            x: [56, 0, -56],
                            opacity: [0, 1, 0],
                            scale: [0.5, 1, 0.5],
                        }}
                        transition={{
                            duration: 1.6,
                            delay: i * (1.6 / 3),
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    >
                        <Sparkles className="w-7 h-7 text-primary" />
                    </motion.div>
                ))}
            </div>
            <p className="text-sm text-muted-foreground">Generating content…</p>
        </div>
    );
}

// ── Hand-drawn X icon ────────────────────────────────────────────────────────
function DrawableX({ draw }: { draw: boolean }) {
    const line = (delay: number) => ({
        animate: draw
            ? { pathLength: [0, 1], transition: { duration: 0.2, ease: 'easeOut' as const, delay } }
            : { pathLength: 1 },
    });
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <motion.line x1="18" y1="6" x2="6" y2="18" initial={{ pathLength: 1 }} {...line(0)} />
            <motion.line x1="6" y1="6" x2="18" y2="18" initial={{ pathLength: 1 }} {...line(0.18)} />
        </svg>
    );
}

// ── Hand-drawn checkmark icon ────────────────────────────────────────────────
function DrawableCheck({ draw }: { draw: boolean }) {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <motion.polyline
                points="4 12 9 17 20 6"
                initial={{ pathLength: 1 }}
                animate={draw
                    ? { pathLength: [0, 1], transition: { duration: 0.3, ease: 'easeOut' } }
                    : { pathLength: 1 }
                }
            />
        </svg>
    );
}

// ── Modal ────────────────────────────────────────────────────────────────────
export function AIReviewModal() {
    const {
        showReviewModal,
        originalText,
        newText,
        currentField,
        acceptChanges,
        discardChanges,
        cancelRequest,
        isLoading,
        error
    } = useAIWriterStore();

    const [rejectHovered, setRejectHovered] = useState(false);
    const [acceptHovered, setAcceptHovered] = useState(false);

    const fieldLabel = currentField
        ?.replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase()) || 'Field';

    return (
        <Dialog open={showReviewModal} onOpenChange={(open) => { if (!open) cancelRequest(); }}>
            {/*
              flex flex-col + max-h keeps the modal bounded.
              The scrollable content area grows, the button bar is always pinned.
            */}
            <DialogContent
                className="sm:max-w-3xl flex flex-col max-h-[82vh] overflow-hidden p-0"
                onPointerDownOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                {/* Header — fixed */}
                <DialogHeader className="px-6 pt-6 pb-0 flex-shrink-0">
                    <DialogTitle>Review Changes - {fieldLabel}</DialogTitle>
                </DialogHeader>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto min-h-0 px-6 py-4">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-16">
                            <PortalLoader />
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-3">
                            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
                                {error.toLowerCase().includes('too long') ? (
                                    <Timer className="w-6 h-6 text-destructive" />
                                ) : error.toLowerCase().includes('server') || error.toLowerCase().includes('500') || error.toLowerCase().includes('failed to fetch') ? (
                                    <ServerCrash className="w-6 h-6 text-destructive" />
                                ) : (
                                    <AlertTriangle className="w-6 h-6 text-destructive" />
                                )}
                            </div>
                            <p className="text-sm font-medium text-destructive px-8 text-center">{error}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            {/* Original Text */}
                            <div className="space-y-2">
                                <h4 className="text-sm font-medium text-muted-foreground">Original text</h4>
                                <div className="p-4 rounded-2xl bg-muted/50 text-sm min-h-[120px] max-h-[200px] overflow-y-auto whitespace-pre-wrap">
                                    {originalText || (
                                        <span className="text-muted-foreground italic">No original content</span>
                                    )}
                                </div>
                            </div>

                            {/* New Text */}
                            <div className="space-y-2">
                                <h4 className="text-sm font-medium text-primary">New text</h4>
                                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 text-sm min-h-[120px] max-h-[200px] overflow-y-auto whitespace-pre-wrap">
                                    {newText || (
                                        <span className="text-muted-foreground italic">No content generated</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Buttons — pinned at bottom, shown only when there's content to act on */}
                {!isLoading && !error && (
                    <div className="flex-shrink-0 flex justify-end gap-3 border-t px-6 py-4">
                        {/* Reject */}
                        <motion.div
                            whileTap={{ scale: 0.95 }}
                            onHoverStart={() => setRejectHovered(true)}
                            onHoverEnd={() => setRejectHovered(false)}
                        >
                            <Button
                                variant="outline"
                                onClick={discardChanges}
                                className="gap-2 border-red-500/40 text-red-500 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/60 transition-colors rounded-full px-5"
                            >
                                <DrawableX draw={rejectHovered} />
                                {error ? 'Close' : 'Reject'}
                            </Button>
                        </motion.div>

                        {/* Accept (hidden on error) */}
                        {!error && (
                            <motion.div
                                whileTap={{ scale: 0.95 }}
                                onHoverStart={() => setAcceptHovered(true)}
                                onHoverEnd={() => setAcceptHovered(false)}
                            >
                                <Button
                                    onClick={acceptChanges}
                                    disabled={!newText}
                                    className="gap-2 bg-green-600 hover:bg-green-500 text-white border-0 transition-colors rounded-full px-5"
                                >
                                    <DrawableCheck draw={acceptHovered} />
                                    Accept
                                </Button>
                            </motion.div>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
