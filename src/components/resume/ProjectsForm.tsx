import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, ChevronDown, ChevronUp, FolderGit2, Link as LinkIcon, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

import { AIWriterButton } from '@/components/ui/AIWriterButton';
import { Button } from '@/components/ui/button';
import { FieldTip } from '@/components/ui/FieldTip';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TechChipsInput } from '@/components/ui/TechChipsInput';
import { Textarea } from '@/components/ui/textarea';
import { TrashAnimatedIcon } from '@/components/ui/TrashAnimatedIcon';
import { cn } from '@/lib/utils';
import { useResumeStore } from '@/stores/resumeStore';

export const ProjectsForm = () => {
  const { resumeData, addProject, updateProject, deleteProject } = useResumeStore();
  const { items: projects } = resumeData.sections.projects;
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (projects.length > 0 && !expandedId) {
      setExpandedId(projects[projects.length - 1].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects]);

  const handleAdd = () => {
    addProject();
    setTimeout(() => {
      const lastProj = projects[projects.length - 1];
      if (lastProj) setExpandedId(lastProj.id);
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
          Showcase your personal projects, open-source contributions, or key works.
        </p>
        <Button onClick={handleAdd} className="gap-2 shadow-sm">
          <Plus className="w-4 h-4" />
          Add Project
        </Button>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {projects.map((proj, index) => {
            const isExpanded = expandedId === proj.id;

            return (
              <motion.div
                key={proj.id}
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
                  onClick={() => setExpandedId(isExpanded ? null : proj.id)}
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
                    <motion.div whileHover="hover" whileTap="tap">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteProject(proj.id);
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
                      <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label className="font-medium">
                              Project Name <span className="text-red-500">*</span>
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
                              Description / Key Features
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
                          <Textarea
                            value={proj.description}
                            onChange={(e) =>
                              updateProject(proj.id, { description: e.target.value })
                            }
                            placeholder="• Built a full-stack app using...&#10;• Implemented real-time updates with..."
                            className="min-h-[150px]"
                            rows={6}
                          />
                          <FieldTip>
                            Briefly explain the project's purpose and highlight your technical
                            contributions. Use bullet points for readability.
                          </FieldTip>
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

      {projects.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/20">
          <div className="bg-background w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <FolderGit2 className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="font-medium text-lg">No projects added</h3>
          <p className="text-muted-foreground max-w-[250px] mx-auto mt-1 mb-6">
            Share your best work and technical experiments.
          </p>
          <Button onClick={handleAdd} variant="outline" className="gap-2">
            <Plus className="w-4 h-4" />
            Add your first project
          </Button>
        </div>
      )}
    </motion.div>
  );
};
