import { motion } from 'framer-motion';
import { ChevronDown, Mail, Phone, User } from 'lucide-react';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/components/ui/accordion';
import { AIWriterButton } from '@/shared/components/ui/AIWriterButton';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { RichTextEditor } from '@/shared/components/ui/RichTextEditor';
import { TrashAnimatedIcon } from '@/shared/components/ui/TrashAnimatedIcon';
import { cn } from '@/shared/lib/utils';
import { useResumeStore } from '@/shared/stores/resumeStore';

import { SectionListManager } from './shared/SectionListManager';

export const ReferencesForm = () => {
  const { resumeData, addItem, updateItem, deleteItem } = useResumeStore();
  const { items: references } = resumeData.sections.references;

  const defaultNewItem = (id: string) => ({
    id,
    name: '',
    position: '',
    phone: '',
    email: '',
    description: '',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <SectionListManager
        items={references}
        onAdd={(newItem) => addItem('references', newItem)}
        defaultNewItem={defaultNewItem}
        addButtonLabel="Add Reference"
        emptyMessage="Provide professional references who can vouch for your work and character."
        renderItem={(ref, index, isExpanded) => (
          <AccordionItem
            key={ref.id}
            value={ref.id}
            className={cn(
              'group border rounded-xl overflow-hidden transition-all duration-200 border-b-0',
              isExpanded
                ? 'ring-1 ring-primary/20 shadow-md bg-card'
                : 'hover:border-primary/30 hover:shadow-sm bg-card/50',
            )}
          >
            <AccordionTrigger className="hover:no-underline p-0 [&>svg]:hidden">
              <div
                className={cn(
                  'flex items-center justify-between p-4 w-full text-left',
                  isExpanded && 'border-b bg-muted/30',
                )}
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base truncate">
                    {ref.name || `Reference ${index + 1}`}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                    {ref.position && (
                      <span className="flex items-center gap-1.5 font-medium text-foreground/80">
                        <User className="w-3.5 h-3.5" />
                        {ref.position}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteItem('references', ref.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-10 w-10"
                  >
                    <TrashAnimatedIcon className="w-4 h-4" />
                  </Button>
                  <div className="text-muted-foreground p-1">
                    <ChevronDown
                      className={cn(
                        'w-5 h-5 transition-transform duration-200',
                        isExpanded && 'rotate-180',
                      )}
                    />
                  </div>
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent className="p-0">
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="font-medium">
                    Name <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      value={ref.name}
                      onChange={(e) => updateItem('references', ref.id, { name: e.target.value })}
                      placeholder="e.g. Jane Smith"
                      className="pl-9"
                    />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-medium">Position / Relationship</Label>
                  <Input
                    value={ref.position}
                    onChange={(e) => updateItem('references', ref.id, { position: e.target.value })}
                    placeholder="e.g. Manager at Previous Co"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-medium">
                    Email <span className="text-foreground/50">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      value={ref.email}
                      onChange={(e) => updateItem('references', ref.id, { email: e.target.value })}
                      placeholder="e.g. jane@example.com"
                      className="pl-9"
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-medium">
                    Phone <span className="text-foreground/50">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      value={ref.phone}
                      onChange={(e) => updateItem('references', ref.id, { phone: e.target.value })}
                      placeholder="e.g. +1 234 567 890"
                      className="pl-9"
                    />
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <p className="text-xs text-muted-foreground">
                    * At least one contact method (Email or Phone) is required.
                  </p>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="font-medium">Summary / Context</Label>
                    <AIWriterButton
                      fieldName="references"
                      fieldLabel="Reference"
                      fieldValue={ref.description || ''}
                      onUpdate={(newText) =>
                        updateItem('references', ref.id, { description: newText })
                      }
                    />
                  </div>
                  <RichTextEditor
                    value={ref.description || ''}
                    onChange={(value) => updateItem('references', ref.id, { description: value })}
                    placeholder="Briefly describe how you worked together or what they can speak to."
                    className="min-h-[80px]"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      />
    </motion.div>
  );
};
