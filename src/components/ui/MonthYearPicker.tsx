import React from 'react';
import { Label } from '@/components/ui/label';

interface MonthYearPickerProps {
    label: string;
    value: string; // Format: "YYYY-MM" for compatibility
    onChange: (value: string) => void;
    required?: boolean;
    disabled?: boolean;
}

const MONTHS = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
];

// Generate years from 1970 to current year + 10
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1970 + 11 }, (_, i) => (currentYear + 10 - i).toString());

export const MonthYearPicker: React.FC<MonthYearPickerProps> = ({
    label,
    value,
    onChange,
    required = false,
    disabled = false,
}) => {
    // Parse the value (format: "YYYY-MM")
    const [year, month] = value ? value.split('-') : ['', ''];

    const handleMonthChange = (newMonth: string) => {
        const newValue = year ? `${year}-${newMonth}` : `${currentYear}-${newMonth}`;
        onChange(newValue);
    };

    const handleYearChange = (newYear: string) => {
        const newValue = month ? `${newYear}-${month}` : `${newYear}-01`;
        onChange(newValue);
    };

    const selectClassName = `flex h-10 w-full rounded-full border border-input bg-background pl-3 pr-8 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 appearance-none bg-no-repeat bg-[length:16px] bg-[right_8px_center] ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;

    return (
        <div className="space-y-2">
            <Label>{label}{required && ' *'}</Label>
            <div className="flex gap-2">
                <select
                    value={month}
                    onChange={(e) => handleMonthChange(e.target.value)}
                    className={selectClassName}
                    style={{ flex: 2 }}
                    disabled={disabled}
                >
                    <option value="">Month</option>
                    {MONTHS.map((m) => (
                        <option key={m.value} value={m.value}>
                            {m.label}
                        </option>
                    ))}
                </select>
                <select
                    value={year}
                    onChange={(e) => handleYearChange(e.target.value)}
                    className={selectClassName}
                    style={{ flex: 1 }}
                    disabled={disabled}
                >
                    <option value="">Year</option>
                    {YEARS.map((y) => (
                        <option key={y} value={y}>
                            {y}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};
