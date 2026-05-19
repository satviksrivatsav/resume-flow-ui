import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';

import { ActionListMenu } from '@/shared/components/ui/ActionListMenu';
import { AnimatedIcon } from '@/shared/components/ui/AnimatedIcon';
import { Button } from '@/shared/components/ui/button';
import { useAIWriterStore } from '@/shared/stores/aiWriterStore';
import { useResumeStore } from '@/shared/stores/resumeStore';

interface AIWriterButtonProps {
  fieldName: string;
  fieldLabel: string;
  fieldValue: string;
  onUpdate: (newValue: string) => void;
}

export function AIWriterButton({
  fieldName,
  fieldValue,
  onUpdate,
}: AIWriterButtonProps) {
  const { openInstructionModal, isLoading } = useAIWriterStore();
  const { resumeData } = useResumeStore();
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAction = (action: 'REWRITE' | 'GENERATE') => {
    console.log('🔘 AI Writer Button clicked:', { fieldName, action });
    openInstructionModal(fieldName, action, fieldValue, onUpdate, resumeData);
  };

  const hasContent = (() => {
    if (!fieldValue) return false;
    // Parse HTML to get plain text, so empty rich text like <p><br></p> is correctly identified as empty
    const doc = new DOMParser().parseFromString(fieldValue, 'text/html');
    return (doc.body.textContent || '').trim().length > 0;
  })();

  const menuItems = [
    {
      label: 'Generate Content',
      icon: Sparkles,
      onClick: () => handleAction('GENERATE'),
    },
    ...(hasContent
      ? [
          {
            label: 'Rewrite Section',
            icon: Sparkles,
            onClick: () => handleAction('REWRITE'),
          },
        ]
      : []),
  ];

  return (
    <ActionListMenu
      align="start"
      className="w-48"
      trigger={
        <motion.div
          onHoverStart={() => {
            setIsHovered(true);
            setIsAnimating(true);
          }}
          onHoverEnd={() => setIsHovered(false)}
          animate={isHovered || isAnimating ? 'hover' : 'initial'}
          onAnimationComplete={() => setIsAnimating(false)}
          whileTap="tap"
          style={{ display: 'inline-flex', overflow: 'hidden', flexShrink: 0 }}
        >
          <Button
            variant="ghost"
            className="ai-writer-trigger gap-1.5 text-xs text-primary hover:text-primary hover:bg-primary/10 shrink-0 whitespace-nowrap"
            disabled={isLoading}
          >
            <AnimatedIcon icon={Sparkles} preset="portal" className="w-3.5 h-3.5" />
            AI Writer
          </Button>
        </motion.div>
      }
      items={menuItems}
    />
  );
}
