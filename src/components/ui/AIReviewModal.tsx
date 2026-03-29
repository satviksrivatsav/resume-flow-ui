import { Check, RotateCcw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useAIWriterStore } from '@/stores/aiWriterStore';

export function AIReviewModal() {
    const {
        showReviewModal,
        originalText,
        newText,
        currentField,
        currentAction,
        acceptChanges,
        discardChanges,
        isLoading,
        error
    } = useAIWriterStore();

    const fieldLabel = currentField
        ?.replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase()) || 'Field';

    return (
        <Dialog open={showReviewModal} onOpenChange={() => { }}>
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

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-2 pt-2 border-t">
                            <Button
                                variant="outline"
                                onClick={discardChanges}
                                className="gap-2"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Undo
                            </Button>
                            <Button
                                onClick={acceptChanges}
                                className="gap-2"
                                disabled={!newText}
                            >
                                <Check className="w-4 h-4" />
                                Accept
                            </Button>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
