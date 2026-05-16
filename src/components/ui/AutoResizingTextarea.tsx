import * as React from 'react';
import { useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export interface AutoResizingTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onValueChange?: (value: string) => void;
}

const AutoResizingTextarea = React.forwardRef<HTMLTextAreaElement, AutoResizingTextareaProps>(
  ({ className, value, onChange, onValueChange, ...props }, ref) => {
    const internalRef = useRef<HTMLTextAreaElement>(null);
    const textareaRef = (ref as React.MutableRefObject<HTMLTextAreaElement>) || internalRef;

    const adjustHeight = () => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    };

    useEffect(() => {
      adjustHeight();
    }, [value]);

    // Handle window resize
    useEffect(() => {
      window.addEventListener('resize', adjustHeight);
      return () => window.removeEventListener('resize', adjustHeight);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(e);
      onValueChange?.(e.target.value);
      adjustHeight();
    };

    return (
      <Textarea
        {...props}
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        className={cn(
          'resize-none overflow-hidden transition-[height] duration-200 min-h-[unset]',
          className,
        )}
      />
    );
  },
);

AutoResizingTextarea.displayName = 'AutoResizingTextarea';

export { AutoResizingTextarea };
