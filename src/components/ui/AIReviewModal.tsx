import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useAIWriterStore } from '@/stores/aiWriterStore';
import { motion } from 'framer-motion';

// ── Hand-drawn X icon ────────────────────────────────────────────────────────
// Two diagonal lines drawn one after the other on hover.
function DrawableX({ draw }: { draw: boolean }) {
    const line = (delay: number) => ({
        animate: draw
            ? { pathLength: [0, 1], transition: { duration: 0.2, ease: "easeOut" as const, delay } }
            : { pathLength: 1 },
    });
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            {/* first stroke: top-right → bottom-left */}
            <motion.line x1="18" y1="6" x2="6" y2="18"
                initial={{ pathLength: 1 }}
                {...line(0)} />
            {/* second stroke: top-left → bottom-right */}
            <motion.line x1="6" y1="6" x2="18" y2="18"
                initial={{ pathLength: 1 }}
                {...line(0.18)} />
        </svg>
    );
}

// ── Hand-drawn checkmark icon ────────────────────────────────────────────────
// Single path drawn tip-to-tip on hover.
function DrawableCheck({ draw }: { draw: boolean }) {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <motion.polyline
                points="4 12 9 17 20 6"
                initial={{ pathLength: 1 }}
                animate={draw
                    ? { pathLength: [0, 1], transition: { duration: 0.3, ease: "easeOut" } }
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
        currentAction,
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
            <DialogContent
                className="sm:max-w-3xl max-h-[80vh] overflow-hidden"
                onPointerDownOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>Review Changes - {fieldLabel}</DialogTitle>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-4">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <p className="text-muted-foreground">Generating content...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-4">
                        <p className="text-destructive">{error}</p>
                        <Button variant="outline" onClick={discardChanges}>
                            Close
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 gap-4 py-4 overflow-hidden">
                            {/* Original Text */}
                            <div className="space-y-2">
                                <h4 className="text-sm font-medium text-muted-foreground">Original text</h4>
                                <div className="p-4 rounded-2xl bg-muted/50 text-sm min-h-[200px] max-h-[400px] overflow-y-auto whitespace-pre-wrap">
                                    {originalText || (
                                        <span className="text-muted-foreground italic">No original content</span>
                                    )}
                                </div>
                            </div>

                            {/* New Text */}
                            <div className="space-y-2">
                                <h4 className="text-sm font-medium text-primary">New text</h4>
                                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 text-sm min-h-[200px] max-h-[400px] overflow-y-auto whitespace-pre-wrap">
                                    {newText || (
                                        <span className="text-muted-foreground italic">No content generated</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons — pt-6 matches DialogContent's p-6 bottom padding */}
                        <div className="flex justify-end gap-3 border-t pt-6">
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
                                    Reject
                                </Button>
                            </motion.div>

                            {/* Accept */}
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
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
