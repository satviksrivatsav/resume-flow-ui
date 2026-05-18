import { motion } from 'framer-motion';
import { Calendar, ChevronDown, Link as LinkIcon } from 'lucide-react';

import { AIWriterButton } from '@/shared/components/ui/AIWriterButton';
import { Button } from '@/shared/components/ui/button';
import { FieldTip } from '@/shared/components/ui/FieldTip';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { TechChipsInput } from '@/shared/components/ui/TechChipsInput';
import { RichTextEditor } from '@/shared/components/ui/RichTextEditor';
import { TrashAnimatedIcon } from '@/shared/components/ui/TrashAnimatedIcon';
import { cn } from '@/shared/lib/utils';
import { useResumeStore } from '@/shared/stores/resumeStore';
import { SectionListManager } from './shared/SectionListManager';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion';

export const ProjectsForm = () => {
  const { resumeData, addItem, updateProject, deleteProject } = useResumeStore();
  const { items: projects } = resumeData.sections.projects;

  const defaultNewItem = (id: string) => ({
    id,
    name: '',
    description: '',
    period: '',
    website: { label: '', href: '' },
    keywords: [],
    visible: true,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <SectionListManager
        items={projects}
        onAdd={(newItem) => addItem('projects', newItem)}
        defaultNewItem={defaultNewItem}
        addButtonLabel="Add Project"
        emptyMessage="Showcase your personal projects, open-source contributions, or key works."
        renderItem={(proj, index, isExpanded) => (
          <AccordionItem
            key={proj.id}
            value={proj.id}
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
                    {proj.name || `Project ${index + 1}`}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                    {proj.period && (
                      <span className="flex items-center gap-1.5 font-medium text-foreground/80">
                        <Calendar className="w-3.5 h-3.5" />
                        {proj.period}
                      </span>
                    )}
                    {proj.website.href && (
                      <span className="flex items-center gap-1.5">
                        <LinkIcon className="w-3.5 h-3.5" />
                        {proj.website.label || 'Link'}
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
                      deleteProject(proj.id);
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
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="font-medium">
                      Project Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      value={proj.name}
                      onChange={(e) => updateProject(proj.id, { name: e.target.value })}
                      placeholder="e.g. Personal Portfolio"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="font-medium">Period</Label>
                    <Input
                      value={proj.period}
                      onChange={(e) => updateProject(proj.id, { period: e.target.value })}
                      placeholder="e.g. 2023-01 - 2023-06"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="font-medium">Project Link</Label>
                    <div className="relative">
                      <Input
                        value={proj.website.href}
                        onChange={(e) =>
                          updateProject(proj.id, {
                            website: { ...proj.website, href: e.target.value },
                          })
                        }
                        placeholder="e.g. https://github.com/yourusername/project"
                        className="pl-9"
                      />
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                <TechChipsInput
                  label="Technologies Used"
                  value={proj.keywords}
                  onChange={(techs) => updateProject(proj.id, { keywords: techs })}
                  placeholder="Type a technology and press Enter"
                />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold">
                      Description / Key Features <span className="text-destructive">*</span>
                    </Label>
                    <AIWriterButton
                      fieldName="projects"
                      fieldLabel="Project"
                      fieldValue={proj.description || ''}
                      onUpdate={(newText) =>
                        updateProject(proj.id, { description: newText })
                      }
                    />
                  </div>
                  <RichTextEditor
                    value={proj.description || ''}
                    onChange={(value) =>
                      updateProject(proj.id, { description: value })
                    }
                    placeholder="• Built a full-stack app using...&#10;• Implemented real-time updates with..."
                    className="min-h-[150px]"
                  />
                  <FieldTip>
                    Briefly explain the project's purpose and highlight your technical
                    contributions. Use bullet points for readability.
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

