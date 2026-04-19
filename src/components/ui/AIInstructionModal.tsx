import { useState } from 'react';
import { Sparkles, Briefcase, Coffee, Zap, Smile, List, AlignLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useAIWriterStore } from '@/stores/aiWriterStore';
import { toast } from 'sonner';

const toneOptions = [
    { value: 'professional', label: 'Professional', icon: Briefcase },
    { value: 'casual', label: 'Casual', icon: Coffee },
    { value: 'confident', label: 'Confident', icon: Zap },
    { value: 'friendly', label: 'Friendly', icon: Smile },
] as const;

const formatOptions = [
    { value: 'bullets', label: 'Bullets', icon: List },
    { value: 'paragraph', label: 'Paragraph', icon: AlignLeft },
] as const;

export function AIInstructionModal() {
    const {
        showInstructionModal,
        currentField,
        currentAction,
        closeInstructionModal,
        submitAIRequest,
        isLoading
    } = useAIWriterStore();

    const [instruction, setInstruction] = useState('');
    const [tone, setTone] = useState<string | null>(null);
    const [format, setFormat] = useState<string | null>(null);

    const handleSubmit = async () => {
        console.log('🚀 Submitting AI Request...');
        try {
            await submitAIRequest({
                instruction: instruction || undefined,
                tone: tone || undefined,
                format: format || undefined,
            });
            // Reset local state after successful submit
            setInstruction('');
            setTone(null);
            setFormat(null);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Failed to process request';
            toast.error(message);
        }
    };

    const handleClose = () => {
        closeInstructionModal();
        setInstruction('');
        setTone(null);
        setFormat(null);
    };

    const fieldLabel = currentField
        ?.replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase()) || 'Field';

    const actionLabel = currentAction === 'REWRITE' ? 'Rewrite' : 'Generate';

    return (
        <Dialog open={showInstructionModal} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        {actionLabel} {fieldLabel}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* Custom Instructions */}
                    <div className="space-y-2">
                        <Label htmlFor="instruction">Add custom instructions</Label>
                        <Input
                            id="instruction"
                            placeholder="e.g., Make it more impactful with metrics"
                            value={instruction}
                            onChange={(e) => setInstruction(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
                                    e.preventDefault();
                                    handleSubmit();
                                }
                            }}
                            autoFocus
                        />
                    </div>

                    {/* Tone Selector */}
                    <div className="space-y-2">
                        <Label>Tone of Voice</Label>
                        <div className="flex flex-wrap gap-2">
                            {toneOptions.map((option) => (
                                <Button
                                    key={option.value}
                                    variant={tone === option.value ? 'secondary' : 'outline'}
                                    className={`gap-1.5 h-10 px-4 ${tone === option.value ? 'ring-1 ring-primary/30' : ''}`}
                                    onClick={() => setTone(tone === option.value ? null : option.value)}
                                >
                                    <option.icon className="w-3.5 h-3.5" />
                                    {option.label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Format Selector */}
                    <div className="space-y-2">
                        <Label>Format</Label>
                        <div className="flex gap-2">
                            {formatOptions.map((option) => (
                                <Button
                                    key={option.value}
                                    variant={format === option.value ? 'secondary' : 'outline'}
                                    className={`gap-1.5 h-10 px-4 ${format === option.value ? 'ring-1 ring-primary/30' : ''}`}
                                    onClick={() => setFormat(format === option.value ? null : option.value)}
                                >
                                    <option.icon className="w-3.5 h-3.5" />
                                    {option.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <div className="flex justify-end pt-2">
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="gap-2"
                    >
                        <Sparkles className="w-4 h-4" />
                        {actionLabel}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
