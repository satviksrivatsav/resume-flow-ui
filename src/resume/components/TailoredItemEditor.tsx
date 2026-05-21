import { useEffect, useState } from 'react';

import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { RichTextEditor } from '@/shared/components/ui/RichTextEditor';
import { TechChipsInput } from '@/shared/components/ui/TechChipsInput';
import { cn } from '@/shared/lib/utils';

interface TailoredContentObject {
  headline?: string;
  content?: string;
  name?: string;
  keywords?: string[];
  description?: string;
  summary?: string;
  bullets?: string[];
}

interface TailoredItemEditorProps {
  sectionId: string;
  content: TailoredContentObject | string | null | undefined;
  onChange?: (newContent: TailoredContentObject | string | null | undefined) => void;
  readOnly?: boolean;
}

export const TailoredItemEditor = ({
  sectionId,
  content,
  onChange,
  readOnly = false,
}: TailoredItemEditorProps) => {
  const [localContent, setLocalContent] = useState<
    TailoredContentObject | string | null | undefined
  >(content);

  // Initialize local state, merging summary/bullets into description if needed
  useEffect(() => {
    if (typeof content === 'object' && content !== null) {
      const updated = { ...content } as TailoredContentObject;
      let changed = false;

      // If there are bullets or a summary but no description, merge them into description
      if (
        !updated.description &&
        (updated.summary || (updated.bullets && Array.isArray(updated.bullets)))
      ) {
        const cleanVal = (val: string | undefined): string => {
          if (!val) return '';
          return val
            .replace(/<[^>]*>/g, '')
            .replace(/&nbsp;/g, '')
            .replace(/&#8203;/g, '')
            .replace(/[\u200B-\u200D\uFEFF]/g, '')
            .trim();
        };

        const cleanSummary = cleanVal(updated.summary);
        const activeBullets = (updated.bullets ?? [])
          .map((b: string) => b)
          .filter((b: string) => cleanVal(b).length > 0);

        if (cleanSummary || activeBullets.length > 0) {
          let desc = updated.summary ?? '';
          if (activeBullets.length > 0) {
            if (desc) desc += '\n\n';
            desc += activeBullets.map((b: string) => `• ${b}`).join('\n');
          }
          if (desc) {
            updated.description = desc;
            delete updated.summary;
            delete updated.bullets;
            changed = true;
          }
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
    const isHtml = /<[a-z][\s\S]*>/i.test(localContent);
    return (
      <div className="space-y-4">
        {readOnly ? (
          <div
            className={cn(
              'text-[14px] leading-[1.8] text-muted-foreground/80 ql-editor ql-editor-preview font-normal',
              !isHtml && 'whitespace-pre-wrap',
            )}
            dangerouslySetInnerHTML={{ __html: localContent }}
          />
        ) : (
          <RichTextEditor
            value={localContent}
            onChange={(value) => {
              setLocalContent(value);
              onChange?.(value);
            }}
            className="text-[14px] leading-[1.8] font-normal"
            placeholder="Edit content..."
          />
        )}
      </div>
    );
  }

  const handleChange = (field: keyof TailoredContentObject, value: string | string[]) => {
    if (typeof localContent === 'object' && localContent !== null) {
      const updated = { ...localContent, [field]: value };
      setLocalContent(updated);
      onChange?.(updated);
    }
  };

  const renderField = (
    label: string,
    value: string | undefined,
    field: keyof TailoredContentObject,
    type: 'input' | 'textarea',
  ) => {
    if (readOnly) {
      return (
        <div className="space-y-2">
          <Label className="text-muted-foreground font-bold tracking-wider uppercase text-[10px]">
            {label}
          </Label>
          {type === 'textarea' ? (
            <div
              className={cn(
                'text-[14px] leading-[1.8] ql-editor ql-editor-preview font-normal',
                label === 'Description' ? 'text-muted-foreground/80' : 'text-foreground/90',
                !/<[a-z][\s\S]*>/i.test(value ?? '') && 'whitespace-pre-wrap',
              )}
              dangerouslySetInnerHTML={{ __html: value ?? '' }}
            />
          ) : (
            <div className="text-[14px] leading-[1.8] text-foreground/90 font-normal">
              {value ?? <span className="italic opacity-50">Empty</span>}
            </div>
          )}
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
            value={value ?? ''}
            onChange={(e) => handleChange(field, e.target.value)}
            placeholder={`Edit ${label.toLowerCase()}...`}
          />
        ) : (
          <RichTextEditor
            value={value ?? ''}
            onChange={(value) => handleChange(field, value)}
            className="text-[14px] leading-[1.8]"
            placeholder={`Edit ${label.toLowerCase()}...`}
          />
        )}
      </div>
    );
  };

  const contentObj =
    typeof localContent === 'object' && localContent !== null ? localContent : null;

  return (
    <div className="space-y-6">
      {/* Headline string wrapped in object */}
      {sectionId === 'headline' &&
        contentObj &&
        'headline' in contentObj &&
        renderField('Headline', contentObj.headline, 'headline', 'input')}

      {/* Summary content */}
      {sectionId === 'summary' &&
        contentObj &&
        'content' in contentObj &&
        renderField('Professional Summary', contentObj.content, 'content', 'textarea')}

      {/* Skills Category Name */}
      {sectionId === 'skills' &&
        contentObj &&
        'name' in contentObj &&
        renderField('Category Name', contentObj.name, 'name', 'input')}

      {/* Keywords (Chips) */}
      {contentObj && 'keywords' in contentObj && Array.isArray(contentObj.keywords) && (
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
              {contentObj.keywords.length > 0 ? (
                contentObj.keywords.map((kw: string, i: number) => (
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
              value={contentObj.keywords}
              onChange={(techs) => handleChange('keywords', techs)}
              placeholder="Type a keyword and press Enter"
            />
          )}
        </div>
      )}

      {/* Description / Consolidated Bullets */}
      {contentObj &&
        ('description' in contentObj || 'summary' in contentObj || 'bullets' in contentObj) &&
        sectionId !== 'summary' &&
        sectionId !== 'skills' &&
        renderField('Description', contentObj.description, 'description', 'textarea')}

      {/* Fallback if no known editable fields are found */}
      {contentObj &&
        sectionId !== 'headline' &&
        sectionId !== 'summary' &&
        !('keywords' in contentObj) &&
        !('description' in contentObj) &&
        !('summary' in contentObj) &&
        !('bullets' in contentObj) && (
          <div className="p-4 border border-dashed border-primary/20 rounded-xl text-center">
            <p className="text-sm text-muted-foreground">
              No directly editable structured fields found for this item.
            </p>
          </div>
        )}
    </div>
  );
};
