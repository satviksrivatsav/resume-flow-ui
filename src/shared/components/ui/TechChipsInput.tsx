import { X } from 'lucide-react';
import React, { KeyboardEvent, useState } from 'react';

import { Label } from '@/shared/components/ui/label';

interface TechChipsInputProps {
  label?: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  required?: boolean;
}

export const TechChipsInput: React.FC<TechChipsInputProps> = ({
  label,
  value = [],
  onChange,
  placeholder = 'Type and press Enter to add',
  required = false,
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTech();
    }
  };

  const addTech = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setInputValue('');
    }
  };

  const removeTech = (techToRemove: string) => {
    onChange(value.filter((tech) => tech !== techToRemove));
  };

  const inputClassName =
    'flex-1 min-w-[120px] h-8 bg-transparent border-0 outline-none text-sm placeholder:text-muted-foreground';
  const containerClassName =
    'flex flex-wrap gap-2 py-2 min-h-[42px] w-full border-b border-input focus-within:border-primary transition-all';

  return (
    <div className="space-y-2">
      {label && (
        <Label>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <div className={containerClassName}>
        {value.map((tech) => (
          <span
            key={tech}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider bg-primary/10 text-primary rounded-lg border border-primary/20 transition-all hover:bg-primary/20"
          >
            {tech}
            <button
              type="button"
              onClick={() => removeTech(tech)}
              className="hover:text-primary/80 transition-colors p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTech}
          placeholder={value.length === 0 ? placeholder : 'Add more...'}
          className={inputClassName}
        />
      </div>
      <p className="text-[10px] font-medium text-muted-foreground/50 tracking-wide uppercase px-1">
        Press Enter or comma to add
      </p>
    </div>
  );
};
