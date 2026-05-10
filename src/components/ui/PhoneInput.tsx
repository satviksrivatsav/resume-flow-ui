import { ChevronDown } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

import { COUNTRIES, CountryData, getCountryByCode } from '@/lib/countries';
import { cn } from '@/lib/utils';

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
          'flex items-center rounded-full border border-input bg-background overflow-hidden transition-all duration-200',
          'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:border-primary',
          isOpen && 'ring-2 ring-ring ring-offset-2 border-primary',
        )}
      >
        {/* Country Code Dropdown Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 pl-4 pr-2 h-10 border-r border-input bg-muted/30 hover:bg-muted/50 transition-colors min-w-[90px] focus:outline-none"
        >
          <span className="text-lg">{selectedCountry.flag}</span>
          <span className="text-sm font-medium">{selectedCountry.dialCode}</span>
          <ChevronDown
            className={cn(
              'w-3 h-3 text-muted-foreground transition-transform duration-200',
              isOpen && 'rotate-180',
            )}
          />
        </button>

        {/* Phone Number Input */}
        <input
          type="tel"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 h-10 bg-transparent px-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none"
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 top-full left-0 mt-1 w-64 max-h-60 overflow-auto rounded-2xl border border-input bg-background shadow-lg">
          {/* Search */}
          <div className="sticky top-0 bg-background p-2 border-b">
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
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors rounded-full mx-1 w-[calc(100%-8px)] ${
                  country.code === countryCode ? 'bg-accent' : ''
                }`}
              >
                <span className="text-lg">{country.flag}</span>
                <span className="flex-1 text-left">{country.name}</span>
                <span className="text-muted-foreground">{country.dialCode}</span>
              </button>
            ))}
            {filteredCountries.length === 0 && (
              <div className="px-3 py-2 text-sm text-muted-foreground">No countries found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
