import { useResumeStore } from "@/stores/resumeStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FolderGit2, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { AIWriterButton } from "@/components/ui/AIWriterButton";
import { MonthYearPicker } from "@/components/ui/MonthYearPicker";
import { TechChipsInput } from "@/components/ui/TechChipsInput";

export const ProjectsForm = () => {
  const { resumeData, addProject, updateProject, deleteProject } = useResumeStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (resumeData.projects.length > 0) {
      setExpandedId(resumeData.projects[resumeData.projects.length - 1].id);
    }
  }, [resumeData.projects]);

  const handleAdd = () => {
    addProject();
    // The useEffect will automatically expand the newly added project
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-lg border p-6 space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderGit2 className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Projects</h2>
        </div>
        <Button onClick={handleAdd} size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Add Project
        </Button>
      </div>

      <AnimatePresence mode="popLayout">
        {resumeData.projects.map((proj, index) => (
          <motion.div
            key={proj.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border rounded-lg p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <button
                onClick={() => setExpandedId(expandedId === proj.id ? null : proj.id)}
                className="text-left flex-1"
              >
                <h3 className="font-medium">
                  {proj.name || `Project ${index + 1}`}
                </h3>
                {proj.technologies && (
                  <p className="text-sm text-muted-foreground">{proj.technologies}</p>
                )}
              </button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteProject(proj.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <AnimatePresence>
              {expandedId === proj.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div className="md:col-span-2 space-y-2">
                    <Label>Project Name *</Label>
                    <Input
                      value={proj.name}
                      onChange={(e) => updateProject(proj.id, { name: e.target.value })}
                      placeholder="E-commerce Platform"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label>Your Role</Label>
                    <Input
                      value={proj.role || ''}
                      onChange={(e) => updateProject(proj.id, { role: e.target.value })}
                      placeholder="Lead Developer, Frontend Engineer, etc."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <TechChipsInput
                      label="Technologies"
                      value={Array.isArray(proj.technologies) ? proj.technologies : []}
                      onChange={(techs) => updateProject(proj.id, { technologies: techs })}
                      placeholder="Type a technology and press Enter"
                      required
                    />
                  </div>

                  <MonthYearPicker
                    label="Start Date"
                    value={proj.startDate}
                    onChange={(value) => updateProject(proj.id, { startDate: value })}
                  />

                  <MonthYearPicker
                    label="End Date"
                    value={proj.endDate}
                    onChange={(value) => updateProject(proj.id, { endDate: value })}
                    disabled={proj.ongoing}
                  />

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`ongoing-${proj.id}`}
                      checked={proj.ongoing}
                      onCheckedChange={(checked) =>
                        updateProject(proj.id, { ongoing: checked as boolean })
                      }
                    />
                    <label
                      htmlFor={`ongoing-${proj.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Ongoing project
                    </label>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <Label>Project Link</Label>
                    <Input
                      value={proj.link}
                      onChange={(e) => updateProject(proj.id, { link: e.target.value })}
                      placeholder="https://github.com/username/project"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <Label>Description *</Label>
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
                      placeholder="• Built a full-stack e-commerce platform&#10;• Implemented payment integration"
                      rows={4}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </AnimatePresence>

      {resumeData.projects.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-8">
          No projects added yet. Click "Add Project" to get started.
        </p>
      )}
    </motion.div>
  );
};
