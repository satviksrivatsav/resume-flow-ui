import { Calendar } from 'lucide-react';
import React, { useRef } from 'react';

import { Label } from '@/shared/components/ui/label';
import { cn } from '@/shared/lib/utils';

interface MonthYearPickerProps {
  label: React.ReactNode;
  value: string; // Format: "YYYY-MM"
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
}

export const MonthYearPicker: React.FC<MonthYearPickerProps> = ({
  label,
  value,
  onChange,
  disabled = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleTrigger = () => {
    if (!disabled && inputRef.current) {
      try {
        inputRef.current.showPicker();
      } catch {
        inputRef.current.focus();
      }
    }
  };

  const formatDateDisplay = (val: string) => {
    if (!val) return 'Select Month & Year';
    try {
      const [year, month] = val.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    } catch {
      return val;
    }
  };

  return (
    <div className="space-y-2">
      <Label className="font-medium">{label}</Label>
      <div
        onClick={handleTrigger}
        className={cn(
          'group/picker relative flex items-center cursor-pointer transition-all active:scale-[0.99] rounded-full border border-input bg-background overflow-hidden',
          'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:border-primary transition-all duration-200',
          disabled && 'opacity-50 cursor-not-allowed active:scale-100',
        )}
      >
        {/* Icon Box */}
        <div className="flex items-center justify-center w-10 h-10 border-r border-input bg-muted/30 text-muted-foreground group-hover/picker:bg-muted/50 group-focus-within/picker:text-primary transition-colors">
          <Calendar className="w-4 h-4" />
        </div>

        {/* Visual Display - Replaces the ugly input dashes */}
        <div className="flex-1 h-10 flex items-center px-4 text-sm overflow-hidden">
          <span
            className={cn(
              'truncate',
              !value ? 'text-muted-foreground/40 italic' : 'text-foreground font-medium',
            )}
          >
            {formatDateDisplay(value)}
          </span>
        </div>

        {/* Hidden Native Input */}
        <input
          ref={inputRef}
          type="month"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer pointer-events-none"
          tabIndex={0}
        />
      </div>
    </div>
  );
};
