import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';

import aiSearchAnimation from '@/assets/ai-searching.json';
import { AnimatedIcon } from '@/components/ui/AnimatedIcon';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAIWriterStore } from '@/stores/aiWriterStore';
import { useResumeStore } from '@/stores/resumeStore';


interface AIWriterButtonProps {
  fieldName: string;
  fieldLabel: string;
  fieldValue: string;
  onUpdate: (newValue: string) => void;
}

export function AIWriterButton({
  fieldName,
  fieldLabel,
  fieldValue,
  onUpdate,
}: AIWriterButtonProps) {
  const { openInstructionModal, isLoading } = useAIWriterStore();
  const { resumeData } = useResumeStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAction = (action: 'REWRITE' | 'GENERATE') => {
    console.log('🔘 AI Writer Button clicked:', { fieldName, action });
    openInstructionModal(fieldName, action, fieldValue, onUpdate, resumeData);
    setIsOpen(false);
  };


  const hasContent = (() => {
    if (!fieldValue) return false;
    // Parse HTML to get plain text, so empty rich text like <p><br></p> is correctly identified as empty
    const doc = new DOMParser().parseFromString(fieldValue, 'text/html');
    return (doc.body.textContent || '').trim().length > 0;
  })();

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <motion.div
          onHoverStart={() => {
            setIsHovered(true);
            setIsAnimating(true);
          }}
          onHoverEnd={() => setIsHovered(false)}
          animate={isHovered || isAnimating ? 'hover' : 'initial'}
          onAnimationComplete={() => setIsAnimating(false)}
          whileTap="tap"
          style={{ display: 'inline-flex', overflow: 'hidden' }}
        >
          <Button
            variant="ghost"
            className="gap-1.5 text-xs text-primary hover:text-primary hover:bg-primary/10"
            disabled={isLoading}
          >
            <AnimatedIcon icon={Sparkles} preset="portal" className="w-3.5 h-3.5" />
            AI Writer
          </Button>

        </motion.div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuItem onClick={() => handleAction('GENERATE')}>
          <Sparkles className="w-4 h-4 mr-2" />
          Generate Content
        </DropdownMenuItem>
        {hasContent && (
          <DropdownMenuItem onClick={() => handleAction('REWRITE')}>
            <Sparkles className="w-4 h-4 mr-2" />
            Rewrite Section
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
