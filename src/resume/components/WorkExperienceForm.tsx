import { Briefcase, Calendar, ChevronDown, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

import { AIWriterButton } from '@/shared/components/ui/AIWriterButton';
import { Button } from '@/shared/components/ui/button';
import { FieldTip } from '@/shared/components/ui/FieldTip';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { RichTextEditor } from '@/shared/components/ui/RichTextEditor';
import { TrashAnimatedIcon } from '@/shared/components/ui/TrashAnimatedIcon';
import { useResumeStore } from '@/shared/stores/resumeStore';
import { SectionListManager } from './shared/SectionListManager';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion';
import { cn } from '@/shared/lib/utils';

export const WorkExperienceForm = () => {
  const { resumeData, addItem, updateExperience, deleteExperience } = useResumeStore();
  const { items: workExperience } = resumeData.sections.experience;

  const defaultNewItem = (id: string) => ({
    id,
    company: '',
    position: '',
    location: '',
    period: '',
    description: '',
    website: { label: '', href: '' },
    roles: [],
    visible: true,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <SectionListManager
        items={workExperience}
        onAdd={(newItem) => addItem('experience', newItem)}
        defaultNewItem={defaultNewItem}
        addButtonLabel="Add Experience"
        emptyMessage="Add your professional history to show employers your journey."
        renderItem={(exp, index, isExpanded) => (
          <AccordionItem
            key={exp.id}
            value={exp.id}
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
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-base truncate">
                      {exp.position || `Work Experience ${index + 1}`}
                    </h3>
                    {exp.period.includes('Present') && (
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary rounded-full">
                        Present
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                    {exp.company && (
                      <span className="flex items-center gap-1.5 font-medium text-foreground/80">
                        <Briefcase className="w-3.5 h-3.5" />
                        {exp.company}
                      </span>
                    )}
                    {exp.period && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {exp.period}
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
                      deleteExperience(exp.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-10 w-10"
                  >
                    <TrashAnimatedIcon className="w-4 h-4" />
                  </Button>
                  <div className="text-muted-foreground p-1">
                    <ChevronDown className={cn("w-5 h-5 transition-transform duration-200", isExpanded && "rotate-180")} />
                  </div>
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent className="p-0">
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="font-medium">
                    Position <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={exp.position}
                    onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                    placeholder="e.g. Senior Software Engineer"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-medium">
                    Company Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                    placeholder="e.g. Google"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-medium">Location</Label>
                  <div className="relative">
                    <Input
                      value={exp.location}
                      onChange={(e) =>
                        updateExperience(exp.id, { location: e.target.value })
                      }
                      placeholder="e.g. San Francisco, CA"
                      className="pl-9"
                    />
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-medium">
                    Period <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      value={exp.period}
                      onChange={(e) => updateExperience(exp.id, { period: e.target.value })}
                      placeholder="e.g. 2022-06 - Present"
                      className="pl-9"
                    />
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold">
                      Key Achievements & Responsibilities
                    </Label>
                    <AIWriterButton
                      fieldName="experience"
                      fieldLabel="Work Experience Description"
                      fieldValue={exp.description || ''}
                      onUpdate={(newText) =>
                        updateExperience(exp.id, { description: newText })
                      }
                    />
                  </div>
                  <RichTextEditor
                    value={exp.description || ''}
                    onChange={(value) =>
                      updateExperience(exp.id, { description: value })
                    }
                    placeholder="• Led a team of 5 developers to ship X feature&#10;• Improved app performance by 40% through Y optimization"
                    className="min-h-[150px]"
                  />
                  <FieldTip>
                    Use bullet points and lead with strong action verbs. Quantify impact
                    where possible — e.g., "Reduced load time by 40%" or "Shipped feature
                    used by 10k users."
                  </FieldTip>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      />
    </motion.div>
  );
};
