import { ChevronDown } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

import { COUNTRIES, CountryData, getCountryByCode, cleanPhoneNumber } from '@/shared/lib/countries';
import { cn } from '@/shared/lib/utils';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  countryCode: string;
  onCountryCodeChange: (code: string) => void;
  placeholder?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  countryCode,
  onCountryCodeChange,
  placeholder = 'Phone number',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCountry = getCountryByCode(countryCode) || COUNTRIES[0];

  const filteredCountries = COUNTRIES.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.dialCode.includes(search),
  );

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (country: CountryData) => {
    onCountryCodeChange(country.code);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={cn(
          'flex items-center rounded-full border border-input bg-background ring-offset-background transition-colors overflow-hidden',
          'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
          isOpen && 'ring-2 ring-ring ring-offset-2',
        )}
      >
        {/* Country Code Dropdown Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 pl-4 pr-2 h-10 border-r border-input bg-muted/30 hover:bg-muted/50 transition-colors min-w-[95px] focus:outline-none"
        >
          <span className="text-xs font-bold text-muted-foreground">{selectedCountry.code}</span>
          <span className="text-sm font-medium">{selectedCountry.dialCode}</span>
          <ChevronDown
            className={cn(
              'w-3 h-3 text-muted-foreground transition-transform duration-200',
              isOpen && 'rotate-180',
            )}
          />
        </button>

        {/* Phone Number Input */}
        <div className="flex-1 flex items-center h-10 px-4 py-2">
          <input
            type="tel"
            value={cleanPhoneNumber(value, countryCode)}
            onChange={(e) => {
              let val = e.target.value;
              // If user tries to type/paste the dial code, strip it
              const dialCodeClean = selectedCountry.dialCode.replace(/[\s\-\(\)]/g, '');
              const valClean = val.replace(/[\s\-\(\)]/g, '');
              
              if (valClean.startsWith(dialCodeClean)) {
                // Find where the dial code ends in the original string
                let index = 0;
                let matched = 0;
                while (index < val.length && matched < dialCodeClean.length) {
                  if (/[\s\-\(\)]/.test(val[index])) {
                    index++;
                    continue;
                  }
                  if (val[index] === dialCodeClean[matched]) {
                    index++;
                    matched++;
                  } else {
                    break;
                  }
                }
                val = val.slice(index);
              }

              // Basic cleanup - only numbers and common symbols
              val = val.replace(/[^\d\s\-\(\)]/g, '');
              onChange(val.trim());
            }}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 top-full left-0 mt-1 w-[300px] max-h-60 overflow-y-auto overflow-x-hidden rounded-2xl border border-input bg-background shadow-lg">
          {/* Search */}
          <div className="sticky top-0 bg-background p-2 border-b z-10">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country..."
              className="w-full h-8 px-4 text-sm border border-input rounded-full bg-background focus:outline-none focus:ring-1 focus:ring-ring"
              autoFocus
            />
          </div>

          {/* Country List */}
          <div className="py-1">
            {filteredCountries.map((country) => (
              <button
                key={country.code}
                type="button"
                onClick={() => handleSelect(country)}
                className={cn(
                  "w-[calc(100%-8px)] flex items-center gap-3 px-3 py-2 text-sm hover:bg-accent transition-colors rounded-full mx-1",
                  country.code === countryCode ? "bg-accent" : ""
                )}
              >
                <span className="font-bold text-xs text-muted-foreground w-6 shrink-0">{country.code}</span>
                <span className="flex-1 text-left truncate">{country.name}</span>
                <span className="text-muted-foreground tabular-nums shrink-0">{country.dialCode}</span>
              </button>
            ))}
            {filteredCountries.length === 0 && (
              <div className="px-3 py-2 text-sm text-muted-foreground text-center">No countries found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
