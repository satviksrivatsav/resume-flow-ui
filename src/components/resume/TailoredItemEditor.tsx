import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { AutoResizingTextarea } from '@/components/ui/AutoResizingTextarea';
import { TechChipsInput } from '@/components/ui/TechChipsInput';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface TailoredItemEditorProps {
  sectionId: string;
  content: any;
  onChange?: (newContent: any) => void;
  readOnly?: boolean;
}

export const TailoredItemEditor = ({
  sectionId,
  content,
  onChange,
  readOnly = false,
}: TailoredItemEditorProps) => {
  const [localContent, setLocalContent] = useState<any>(content);

  // Initialize local state, merging summary/bullets into description if needed
  useEffect(() => {
    if (typeof content === 'object' && content !== null) {
      const updated = { ...content };
      let changed = false;

      // If there are bullets or a summary but no description, merge them into description
      if (
        !updated.description &&
        (updated.summary || (updated.bullets && Array.isArray(updated.bullets)))
      ) {
        let desc = updated.summary || '';
        if (updated.bullets && Array.isArray(updated.bullets) && updated.bullets.length > 0) {
          if (desc) desc += '\n\n';
          desc += updated.bullets.map((b: string) => `• ${b}`).join('\n');
        }
        if (desc) {
          updated.description = desc;
          delete updated.summary;
          delete updated.bullets;
          changed = true;
        }
      }

      setLocalContent(updated);

      // If we transformed the structure on mount, sync back to parent
      if (changed && onChange) {
        onChange(updated);
      }
    } else {
      setLocalContent(content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]); // only re-run if external content prop changes identity entirely

  if (typeof localContent === 'string') {
    return (
      <div className="space-y-4">
        {readOnly ? (
          <div className="text-[14px] leading-[1.8] text-muted-foreground/80 whitespace-pre-wrap">
            {localContent}
          </div>
        ) : (
          <AutoResizingTextarea
            value={localContent}
            onChange={(e) => {
              setLocalContent(e.target.value);
              onChange?.(e.target.value);
            }}
            className="text-[14px] leading-[1.8]"
            placeholder="Edit content..."
          />
        )}
      </div>
    );
  }

  const handleChange = (field: string, value: any) => {
    const updated = { ...localContent, [field]: value };
    setLocalContent(updated);
    onChange?.(updated);
  };

  const renderField = (label: string, value: any, field: string, type: 'input' | 'textarea') => {
    if (readOnly) {
      return (
        <div className="space-y-2">
          <Label className="text-muted-foreground font-bold tracking-wider uppercase text-[10px]">
            {label}
          </Label>
          <div
            className={cn(
              'text-[14px] leading-[1.8] whitespace-pre-wrap',
              label === 'Description' ? 'text-muted-foreground/80' : 'text-foreground/90 font-medium',
            )}
          >
            {value || <span className="italic opacity-50">Empty</span>}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <Label className="text-primary font-bold tracking-wider uppercase text-[10px]">
          {label}
        </Label>
        {type === 'input' ? (
          <Input
            value={value || ''}
            onChange={(e) => handleChange(field, e.target.value)}
            placeholder={`Edit ${label.toLowerCase()}...`}
          />
        ) : (
          <AutoResizingTextarea
            value={value || ''}
            onChange={(e) => handleChange(field, e.target.value)}
            className="text-[14px] leading-[1.8]"
            placeholder={`Edit ${label.toLowerCase()}...`}
          />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Headline string wrapped in object */}
      {sectionId === 'headline' &&
        localContent.hasOwnProperty('headline') &&
        renderField('Headline', localContent.headline, 'headline', 'input')}

      {/* Summary content */}
      {sectionId === 'summary' &&
        localContent.hasOwnProperty('content') &&
        renderField('Professional Summary', localContent.content, 'content', 'textarea')}

      {/* Skills Category Name */}
      {sectionId === 'skills' &&
        localContent.hasOwnProperty('name') &&
        renderField('Category Name', localContent.name, 'name', 'input')}

      {/* Keywords (Chips) */}
      {localContent.hasOwnProperty('keywords') && Array.isArray(localContent.keywords) && (
        <div className="space-y-2">
          <Label
            className={cn(
              'font-bold tracking-wider uppercase text-[10px]',
              readOnly ? 'text-muted-foreground' : 'text-primary',
            )}
          >
            Keywords / Skills
          </Label>
          {readOnly ? (
            <div className="flex flex-wrap gap-2 py-2">
              {localContent.keywords.length > 0 ? (
                localContent.keywords.map((kw: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-[11px] font-bold uppercase tracking-wider text-primary/80"
                  >
                    {kw}
                  </span>
                ))
              ) : (
                <span className="italic opacity-50 text-xs">No keywords</span>
              )}
            </div>
          ) : (
            <TechChipsInput
              value={localContent.keywords}
              onChange={(techs) => handleChange('keywords', techs)}
              placeholder="Type a keyword and press Enter"
            />
          )}
        </div>
      )}

      {/* Description / Consolidated Bullets */}
      {(localContent.hasOwnProperty('description') ||
        localContent.hasOwnProperty('summary') ||
        localContent.hasOwnProperty('bullets')) &&
        sectionId !== 'summary' &&
        sectionId !== 'skills' &&
        renderField('Description', localContent.description, 'description', 'textarea')}

      {/* Fallback if no known editable fields are found */}
      {sectionId !== 'headline' &&
        sectionId !== 'summary' &&
        !localContent.hasOwnProperty('keywords') &&
        !localContent.hasOwnProperty('description') &&
        !localContent.hasOwnProperty('summary') &&
        !localContent.hasOwnProperty('bullets') && (
          <div className="p-4 border border-dashed border-primary/20 rounded-xl text-center">
            <p className="text-sm text-muted-foreground">
              No directly editable structured fields found for this item.
            </p>
          </div>
        )}
    </div>
  );
};
