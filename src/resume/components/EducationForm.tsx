import { motion } from 'framer-motion';
import { Calendar, ChevronDown, GraduationCap, MapPin } from 'lucide-react';

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

export const EducationForm = () => {
  const { resumeData, addItem, updateEducation, deleteEducation } = useResumeStore();
  const { items: education } = resumeData.sections.education;

  const defaultNewItem = (id: string) => ({
    id,
    school: '',
    degree: '',
    area: '',
    grade: '',
    location: '',
    period: '',
    description: '',
    visible: true,
    website: { label: '', href: '' },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <SectionListManager
        items={education}
        onAdd={(newItem) => addItem('education', newItem)}
        defaultNewItem={defaultNewItem}
        addButtonLabel="Add Education"
        emptyMessage="Add your academic background to highlight your qualifications."
        renderItem={(edu, index, isExpanded) => (
          <AccordionItem
            key={edu.id}
            value={edu.id}
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
                    {edu.degree
                      ? `${edu.degree}${edu.area ? ` in ${edu.area}` : ''}`
                      : `Education ${index + 1}`}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                    {edu.school && (
                      <span className="flex items-center gap-1.5 font-medium text-foreground/80">
                        <GraduationCap className="w-3.5 h-3.5" />
                        {edu.school}
                      </span>
                    )}
                    {edu.period && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {edu.period}
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
                      deleteEducation(edu.id);
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
                <div className="space-y-2 md:col-span-2">
                  <Label className="font-medium">
                    School / University <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={edu.school}
                    onChange={(e) => updateEducation(edu.id, { school: e.target.value })}
                    placeholder="e.g. Stanford University"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-medium">
                    Degree <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                    placeholder="e.g. Bachelor of Science"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-medium">
                    Field of Study <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={edu.area}
                    onChange={(e) => updateEducation(edu.id, { area: e.target.value })}
                    placeholder="e.g. Computer Science"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-medium">Location</Label>
                  <div className="relative">
                    <Input
                      value={edu.location}
                      onChange={(e) => updateEducation(edu.id, { location: e.target.value })}
                      placeholder="e.g. Stanford, CA"
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
                      value={edu.period}
                      onChange={(e) => updateEducation(edu.id, { period: e.target.value })}
                      placeholder="e.g. 2018-08 - 2022-05"
                      className="pl-9"
                    />
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-medium">Grade / GPA</Label>
                  <Input
                    value={edu.grade}
                    onChange={(e) => updateEducation(edu.id, { grade: e.target.value })}
                    placeholder="e.g. 3.8/4.0"
                  />
                </div>

                <div className="md:col-span-2 space-y-3">
                  <Label className="text-sm font-semibold">Description / Achievements</Label>
                  <RichTextEditor
                    value={edu.description || ''}
                    onChange={(value) => updateEducation(edu.id, { description: value })}
                    placeholder="• Relevant coursework: Data Structures, Algorithms&#10;• Dean's List for 4 semesters"
                    className="min-h-[120px]"
                    showAIWriter={true}
                    aiFieldName="education"
                    aiFieldValue={edu.description || ''}
                    onAiUpdate={(newText) => updateEducation(edu.id, { description: newText })}
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
