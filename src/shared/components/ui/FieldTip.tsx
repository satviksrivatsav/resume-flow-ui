import { Info } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

interface FieldTipProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * A styled inline tip chip shown below long text areas.
 * Uses the same muted-foreground palette as the rest of the form UI.
 */
export function FieldTip({ children, className }: FieldTipProps) {
  return (
    <p
      className={cn(
        'flex items-start gap-1.5 text-[11px] text-muted-foreground/80 leading-relaxed',
        className,
      )}
    >
      <Info className="w-3 h-3 mt-0.5 shrink-0 text-primary/50" />
      <span>{children}</span>
    </p>
  );
}
