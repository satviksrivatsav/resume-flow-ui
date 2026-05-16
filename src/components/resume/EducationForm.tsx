import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, ChevronDown, ChevronUp, GraduationCap, Plus } from 'lucide-react';
import { AIWriterButton } from '@/components/ui/AIWriterButton';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import { TrashAnimatedIcon } from '@/components/ui/TrashAnimatedIcon';
import { cn } from '@/lib/utils';
import { useResumeStore } from '@/stores/resumeStore';

export const EducationForm = () => {
  const { resumeData, addEducation, updateEducation, deleteEducation } = useResumeStore();
  const { items: education } = resumeData.sections.education;
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (education.length > 0 && !expandedId) {
      setExpandedId(education[education.length - 1].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [education]);

  const handleAdd = () => {
    addEducation();
    setTimeout(() => {
      const lastEdu = education[education.length - 1];
      if (lastEdu) setExpandedId(lastEdu.id);
    }, 0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-muted-foreground">
          List your educational background, starting with your most recent degree.
        </p>
        <Button onClick={handleAdd} className="gap-2 shadow-sm">
          <Plus className="w-4 h-4" />
          Add Education
        </Button>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {education.map((edu, index) => {
            const isExpanded = expandedId === edu.id;

            return (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={cn(
                  'group border rounded-xl overflow-hidden transition-all duration-200',
                  isExpanded
                    ? 'ring-1 ring-primary/20 shadow-md bg-card'
                    : 'hover:border-primary/30 hover:shadow-sm bg-card/50',
                )}
              >
                <div
                  className={cn(
                    'flex items-center justify-between p-4 cursor-pointer select-none',
                    isExpanded && 'border-b bg-muted/30',
                  )}
                  onClick={() => setExpandedId(isExpanded ? null : edu.id)}
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
                    <motion.div whileHover="hover" whileTap="tap">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteEducation(edu.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-500 hover:bg-red-500/10 h-10 w-10"
                      >
                        <TrashAnimatedIcon className="w-4 h-4" />
                      </Button>
                    </motion.div>
                    <div className="text-muted-foreground p-1">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                    >
                      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 md:col-span-2">
                          <Label className="font-medium">
                            School / University <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            value={edu.school}
                            onChange={(e) => updateEducation(edu.id, { school: e.target.value })}
                            placeholder="e.g. Stanford University"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="font-medium">
                            Degree <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            value={edu.degree}
                            onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                            placeholder="e.g. Bachelor of Science"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="font-medium">
                            Field of Study <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            value={edu.area}
                            onChange={(e) => updateEducation(edu.id, { area: e.target.value })}
                            placeholder="e.g. Computer Science"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="font-medium">
                            Period <span className="text-red-500">*</span>
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
                          <Label className="font-medium">
                            Grade / GPA <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            value={edu.grade}
                            onChange={(e) => updateEducation(edu.id, { grade: e.target.value })}
                            placeholder="e.g. 3.8/4.0"
                          />
                        </div>

                        <div className="md:col-span-2 space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-semibold">
                              Description / Achievements
                            </Label>
                            <AIWriterButton
                              fieldName="education"
                              fieldLabel="Education Description"
                              fieldValue={edu.description || ''}
                              onUpdate={(newText) =>
                                updateEducation(edu.id, { description: newText })
                              }
                            />
                          </div>
                          <RichTextEditor
                            value={edu.description || ''}
                            onChange={(value) =>
                              updateEducation(edu.id, { description: value })
                            }
                            placeholder="• Relevant coursework: Data Structures, Algorithms&#10;• Dean's List for 4 semesters"
                            className="min-h-[120px]"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {education.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/20">
          <div className="bg-background w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <GraduationCap className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="font-medium text-lg">No education added</h3>
          <p className="text-muted-foreground max-w-[250px] mx-auto mt-1 mb-6">
            Add your academic background to highlight your qualifications.
          </p>
          <Button onClick={handleAdd} variant="outline" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Education
          </Button>
        </div>
      )}
    </motion.div>
  );
};
