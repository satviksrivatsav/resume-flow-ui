import React, { useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

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
            } catch (e) {
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
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</Label>
            <div 
                onClick={handleTrigger}
                className={cn(
                    "group relative flex items-center cursor-pointer transition-all active:scale-[0.99]",
                    disabled && "opacity-50 cursor-not-allowed active:scale-100"
                )}
            >
                {/* Icon Box */}
                <div className="flex items-center justify-center w-10 h-10 rounded-l-full border border-r-0 border-input bg-muted/30 text-muted-foreground group-hover:bg-muted/50 group-focus-within:border-primary group-focus-within:text-primary transition-colors">
                    <Calendar className="w-4 h-4" />
                </div>
                
                {/* Visual Display - Replaces the ugly input dashes */}
                <div className="flex-1 h-10 flex items-center rounded-r-full border border-input bg-background px-4 text-sm ring-offset-background group-focus-within:ring-2 group-focus-within:ring-ring group-focus-within:ring-offset-2 overflow-hidden">
                    <span className={cn(
                        "truncate",
                        !value ? "text-muted-foreground/40 italic" : "text-foreground font-medium"
                    )}>
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
                    tabIndex={-1}
                />
            </div>
        </div>
    );
};
