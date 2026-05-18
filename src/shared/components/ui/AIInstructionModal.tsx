import { AlignLeft, Briefcase, Coffee, List, Smile, Sparkles, Zap } from 'lucide-react';
import { useRef, useState } from 'react';
import { useToast } from '@/shared/hooks/use-toast';

import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { useAIWriterStore } from '@/shared/stores/aiWriterStore';

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
  const { toast } = useToast();
  const {
    showInstructionModal,
    currentField,
    currentAction,
    closeInstructionModal,
    submitAIRequest,
    isLoading,
  } = useAIWriterStore();

  const [instruction, setInstruction] = useState('');
  const [tone, setTone] = useState<string | null>(null);
  const [format, setFormat] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
      toast({ title: 'Error', description: message, variant: 'destructive' });
    }
  };

  const handleClose = () => {
    closeInstructionModal();
    setInstruction('');
    setTone(null);
    setFormat(null);
  };

  const fieldLabel =
    currentField?.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()) || 'Field';

  const actionLabel = currentAction === 'REWRITE' ? 'Rewrite' : 'Generate';

  return (
    <Dialog open={showInstructionModal} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        className="sm:max-w-md"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          inputRef.current?.focus();
        }}
      >
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
              ref={inputRef}
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
          <Button onClick={handleSubmit} disabled={isLoading} className="gap-2">
            <Sparkles className="w-4 h-4" />
            {actionLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
