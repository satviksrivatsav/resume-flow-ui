import { useResumeStore } from "@/stores/resumeStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FolderGit2, Plus, Trash2, ChevronDown, ChevronUp, Link as LinkIcon, Calendar, Code2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { AIWriterButton } from "@/components/ui/AIWriterButton";
import { MonthYearPicker } from "@/components/ui/MonthYearPicker";
import { TechChipsInput } from "@/components/ui/TechChipsInput";
import { cn } from "@/lib/utils";

export const ProjectsForm = () => {
  const { resumeData, addProject, updateProject, deleteProject } = useResumeStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (resumeData.projects.length > 0 && !expandedId) {
      setExpandedId(resumeData.projects[resumeData.projects.length - 1].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeData.projects]);

  const handleAdd = () => {
    addProject();
    setTimeout(() => {
      const lastProj = resumeData.projects[resumeData.projects.length - 1];
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
          Highlight your best projects and technical contributions.
        </p>
        <Button onClick={handleAdd} className="gap-2 shadow-sm">
          <Plus className="w-4 h-4" />
          Add Project
        </Button>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {resumeData.projects.map((proj, index) => {
            const isExpanded = expandedId === proj.id;

            return (
              <motion.div
                key={proj.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={cn(
                  "group border rounded-xl overflow-hidden transition-all duration-200",
                  isExpanded ? "ring-1 ring-primary/20 shadow-md bg-card" : "hover:border-primary/30 hover:shadow-sm bg-card/50"
                )}
              >
                <div 
                  className={cn(
                    "flex items-center justify-between p-4 cursor-pointer select-none",
                    isExpanded && "border-b bg-muted/30"
                  )}
                  onClick={() => setExpandedId(isExpanded ? null : proj.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-base truncate">
                        {proj.name || `Project ${index + 1}`}
                      </h3>
                      {proj.ongoing && (
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary rounded-full">
                          Ongoing
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                      {proj.role && (
                        <span className="flex items-center gap-1.5 font-medium text-foreground/80">
                          <Code2 className="w-3.5 h-3.5" />
                          {proj.role}
                        </span>
                      )}
                      {(proj.startDate || proj.endDate) && (
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {proj.startDate || "Start"} — {proj.ongoing ? "Present" : (proj.endDate || "End")}
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
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-500 hover:bg-red-500/10 h-10 w-10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <div className="text-muted-foreground p-1">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2 space-y-2">
                          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Project Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            value={proj.name}
                            onChange={(e) => updateProject(proj.id, { name: e.target.value })}
                            placeholder="e.g. E-commerce Platform"
                          />
                        </div>

                        <div className="md:col-span-2 space-y-2">
                          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Your Role <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            value={proj.role || ''}
                            onChange={(e) => updateProject(proj.id, { role: e.target.value })}
                            placeholder="e.g. Lead Developer, Frontend Engineer"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <TechChipsInput
                            label={<span>Technologies <span className="text-red-500">*</span></span>}
                            value={Array.isArray(proj.technologies) ? proj.technologies : []}
                            onChange={(techs) => updateProject(proj.id, { technologies: techs })}
                            placeholder="Type a technology and press Enter"
                          />
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                          <MonthYearPicker
                            label={<span>Start Date <span className="text-red-500">*</span></span>}
                            value={proj.startDate}
                            onChange={(value) => updateProject(proj.id, { startDate: value })}
                          />
                          <MonthYearPicker
                            label={<span>End Date {!proj.ongoing && <span className="text-red-500">*</span>}</span>}
                            value={proj.endDate}
                            onChange={(value) => updateProject(proj.id, { endDate: value })}
                            disabled={proj.ongoing}
                          />
                        </div>

                        <div className="md:col-span-2 flex items-center space-x-2 bg-muted/30 p-3 rounded-2xl border border-dashed">
                          <Checkbox
                            id={`ongoing-${proj.id}`}
                            checked={proj.ongoing}
                            onCheckedChange={(checked) =>
                              updateProject(proj.id, { ongoing: checked as boolean })
                            }
                          />
                          <label
                            htmlFor={`ongoing-${proj.id}`}
                            className="text-sm font-medium leading-none cursor-pointer select-none"
                          >
                            This is an ongoing project
                          </label>
                        </div>

                        <div className="md:col-span-2 space-y-2">
                          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Project Link</Label>
                          <div className="relative">
                            <Input
                              value={proj.link}
                              onChange={(e) => updateProject(proj.id, { link: e.target.value })}
                              placeholder="e.g. https://github.com/username/project"
                              className="pl-9"
                            />
                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          </div>
                        </div>

                        <div className="md:col-span-2 space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-semibold">
                              Project Description <span className="text-red-500">*</span>
                            </Label>
                            <AIWriterButton
                              fieldName="description"
                              fieldLabel="Project Description"
                              fieldValue={proj.description || ''}
                              onUpdate={(newText) => updateProject(proj.id, { description: newText })}
                            />
                          </div>
                          <Textarea
                            value={proj.description}
                            onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                            placeholder="• Built a full-stack e-commerce platform using React and Node.js&#10;• Implemented secure payment processing with Stripe"
                            className="min-h-[120px]"
                            rows={4}
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

      {resumeData.projects.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/20">
          <div className="bg-background w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <FolderGit2 className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="font-medium text-lg">No projects yet</h3>
          <p className="text-muted-foreground max-w-[250px] mx-auto mt-1 mb-6">
            Showcase your best work and technical skills through projects.
          </p>
          <Button onClick={handleAdd} variant="outline" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Project
          </Button>
        </div>
      )}
    </motion.div>
  );
};

