import { X } from 'lucide-react';
import React, { KeyboardEvent, useState } from 'react';

import { Label } from '@/components/ui/label';

interface TechChipsInputProps {
  label: string;
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
    'flex-1 min-w-[120px] h-8 bg-transparent border-0 outline-none text-sm placeholder:text-muted-foreground ml-2';
  const containerClassName =
    'flex flex-wrap gap-2 p-1.5 min-h-[42px] w-full rounded-full border border-input bg-background ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2';

  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required && ' *'}
      </Label>
      <div className={containerClassName}>
        {value.map((tech) => (
          <span
            key={tech}
            className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-primary/10 text-primary rounded-full"
          >
            {tech}
            <button
              type="button"
              onClick={() => removeTech(tech)}
              className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
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
      <p className="text-xs text-muted-foreground">Press Enter or comma to add</p>
    </div>
  );
};
