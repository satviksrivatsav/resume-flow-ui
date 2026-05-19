import { motion } from 'framer-motion';
import { Calendar, ChevronDown, HandHelping, Link as LinkIcon, MapPin } from 'lucide-react';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/components/ui/accordion';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { RichTextEditor } from '@/shared/components/ui/RichTextEditor';
import { TrashAnimatedIcon } from '@/shared/components/ui/TrashAnimatedIcon';
import { cn } from '@/shared/lib/utils';
import { useResumeStore } from '@/shared/stores/resumeStore';

import { SectionListManager } from './shared/SectionListManager';

export const VolunteerForm = () => {
  const { resumeData, addItem, updateItem, deleteItem } = useResumeStore();
  const { items: volunteer } = resumeData.sections.volunteer;

  const defaultNewItem = (id: string) => ({
    id,
    organization: '',
    position: '',
    location: '',
    period: '',
    description: '',
    website: { label: '', href: '' },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <SectionListManager
        items={volunteer}
        onAdd={(newItem) => addItem('volunteer', newItem)}
        defaultNewItem={defaultNewItem}
        addButtonLabel="Add Volunteer"
        emptyMessage="List your volunteer work, community involvement, and non-profit contributions."
        renderItem={(vol, index, isExpanded) => (
          <AccordionItem
            key={vol.id}
            value={vol.id}
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
                    {vol.organization || `Volunteer Role ${index + 1}`}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                    {vol.position && (
                      <span className="flex items-center gap-1.5 font-medium text-foreground/80">
                        <HandHelping className="w-3.5 h-3.5" />
                        {vol.position}
                      </span>
                    )}
                    {vol.period && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {vol.period}
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
                      deleteItem('volunteer', vol.id);
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
                    Organization <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={vol.organization}
                    onChange={(e) =>
                      updateItem('volunteer', vol.id, { organization: e.target.value })
                    }
                    placeholder="e.g. Red Cross, Local Shelter"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-medium">
                    Role / Position <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={vol.position}
                    onChange={(e) => updateItem('volunteer', vol.id, { position: e.target.value })}
                    placeholder="e.g. Volunteer Coordinator, Event Staff"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-medium">Location</Label>
                  <div className="relative">
                    <Input
                      value={vol.location}
                      onChange={(e) =>
                        updateItem('volunteer', vol.id, { location: e.target.value })
                      }
                      placeholder="e.g. Remote, New York, NY"
                      className="pl-9"
                    />
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-medium">Period</Label>
                  <div className="relative">
                    <Input
                      value={vol.period}
                      onChange={(e) => updateItem('volunteer', vol.id, { period: e.target.value })}
                      placeholder="e.g. 2021-06 - 2022-01"
                      className="pl-9"
                    />
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="font-medium">Organization Link</Label>
                  <div className="relative">
                    <Input
                      value={vol.website.href}
                      onChange={(e) =>
                        updateItem('volunteer', vol.id, {
                          website: { ...vol.website, href: e.target.value },
                        })
                      }
                      placeholder="e.g. https://organization.org"
                      className="pl-9"
                    />
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label className="font-medium">Description</Label>
                  <RichTextEditor
                    value={vol.description || ''}
                    onChange={(value) => updateItem('volunteer', vol.id, { description: value })}
                    placeholder="Describe your responsibilities and the organization's mission."
                    className="min-h-[100px]"
                    showAIWriter={true}
                    aiFieldName="volunteer"
                    aiFieldValue={vol.description || ''}
                    onAiUpdate={(newText) => updateItem('volunteer', vol.id, { description: newText })}
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
