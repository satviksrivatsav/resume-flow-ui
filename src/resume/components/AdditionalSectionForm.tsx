import { motion } from 'framer-motion';

import { AIWriterButton } from '@/shared/components/ui/AIWriterButton';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { FieldTip } from '@/shared/components/ui/FieldTip';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { MonthYearPicker } from '@/shared/components/ui/MonthYearPicker';
import { RichTextEditor } from '@/shared/components/ui/RichTextEditor';
import { useResumeStore } from '@/shared/stores/resumeStore';
import { useUiStore } from '@/shared/stores/uiStore';

export const AdditionalSectionForm = () => {
  const { resumeData, updateCustomSection, deleteCustomSection } = useResumeStore();
  const { activeTab } = useUiStore();

  const section = resumeData.customSections.find((s) => s.id === activeTab);

  if (!section) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="p-6 border rounded-xl bg-card/50 space-y-6 shadow-sm">
        <div className="space-y-2 max-w-md">
          <Label className="font-medium">
            Section Title <span className="text-destructive">*</span>
          </Label>
          <Input
            placeholder="e.g. Certifications, Awards, Languages"
            value={section.name}
            onChange={(e) => updateCustomSection(section.id, { name: e.target.value })}
            className="font-medium bg-background"
          />
        </div>

        <div className="space-y-4 border p-4 rounded-xl bg-card">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`has-date-${section.id}`}
              checked={(section as any).hasDate || false}
              onCheckedChange={(checked) =>
                updateCustomSection(section.id, { hasDate: checked as boolean })
              }
            />
            <label
              htmlFor={`has-date-${section.id}`}
              className="text-sm font-medium leading-none cursor-pointer select-none"
            >
              Include a date or date range
            </label>
          </div>

          {(section as any).hasDate && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`is-range-${section.id}`}
                  checked={(section as any).isDateRange || false}
                  onCheckedChange={(checked) =>
                    updateCustomSection(section.id, { isDateRange: checked as boolean })
                  }
                />
                <label
                  htmlFor={`is-range-${section.id}`}
                  className="text-sm font-medium leading-none cursor-pointer select-none"
                >
                  This is a date range
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MonthYearPicker
                  label={<span>{(section as any).isDateRange ? 'Start Date' : 'Date'}</span>}
                  value={(section as any).startDate || ''}
                  onChange={(value) => updateCustomSection(section.id, { startDate: value })}
                />

                {(section as any).isDateRange && (
                  <div className="space-y-4">
                    <MonthYearPicker
                      label={<span>End Date</span>}
                      value={(section as any).endDate || ''}
                      onChange={(value) => updateCustomSection(section.id, { endDate: value })}
                      disabled={(section as any).current}
                    />
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`current-${section.id}`}
                        checked={(section as any).current || false}
                        onCheckedChange={(checked) =>
                          updateCustomSection(section.id, { current: checked as boolean })
                        }
                      />
                      <label
                        htmlFor={`current-${section.id}`}
                        className="text-sm font-medium leading-none cursor-pointer select-none"
                      >
                        Ongoing
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="font-medium">Content</Label>
            <AIWriterButton
              fieldName="description"
              fieldLabel="Section Content"
              fieldValue={(section as any).description || ''}
              onUpdate={(newText) => updateCustomSection(section.id, { description: newText })}
            />
          </div>
          <RichTextEditor
            value={(section as any).description || ''}
            onChange={(value) => updateCustomSection(section.id, { description: value })}
            placeholder="Describe your achievements or details here..."
          />
          <FieldTip>
            Use the toolbar to add bullets, bold key terms, or italicise details. Keep each entry
            focused and relevant to the role you're applying for.
          </FieldTip>
        </div>
      </div>
    </motion.div>
  );
};
