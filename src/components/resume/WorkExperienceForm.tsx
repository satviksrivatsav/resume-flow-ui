import { useResumeStore } from "@/stores/resumeStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Briefcase, Plus, Trash2 } from "lucide-react";
import { AIWriterButton } from "@/components/ui/AIWriterButton";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { MonthYearPicker } from "@/components/ui/MonthYearPicker";

export const WorkExperienceForm = () => {
  const { resumeData, addWorkExperience, updateWorkExperience, deleteWorkExperience } = useResumeStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (resumeData.workExperience.length > 0) {
      setExpandedId(resumeData.workExperience[resumeData.workExperience.length - 1].id);
    }
  }, [resumeData.workExperience]);

  const handleAdd = () => {
    const newExperience = {
      id: `work-${Date.now()}`,
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    };
    addWorkExperience(newExperience);
    setExpandedId(newExperience.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-lg border p-6 space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Work Experience</h2>
        </div>
        <Button onClick={handleAdd} size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Add Experience
        </Button>
      </div>

      <AnimatePresence mode="popLayout">
        {resumeData.workExperience.map((exp, index) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border rounded-lg p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <button
                onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
                className="text-left flex-1"
              >
                <h3 className="font-medium">
                  {exp.position || `Experience ${index + 1}`}
                </h3>
                {exp.company && (
                  <p className="text-sm text-muted-foreground">{exp.company}</p>
                )}
              </button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteWorkExperience(exp.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <AnimatePresence>
              {expandedId === exp.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div className="space-y-2">
                    <Label>Position *</Label>
                    <Input
                      value={exp.position}
                      onChange={(e) => updateWorkExperience(exp.id, { position: e.target.value })}
                      placeholder="Software Engineer"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Company</Label>
                    <Input
                      value={exp.company}
                      onChange={(e) => updateWorkExperience(exp.id, { company: e.target.value })}
                      placeholder="Tech Corp"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input
                      value={exp.location}
                      onChange={(e) => updateWorkExperience(exp.id, { location: e.target.value })}
                      placeholder="San Francisco, CA"
                    />
                  </div>

                  <MonthYearPicker
                    label="Start Date"
                    value={exp.startDate}
                    onChange={(value) => updateWorkExperience(exp.id, { startDate: value })}
                    required
                  />

                  <MonthYearPicker
                    label="End Date"
                    value={exp.endDate}
                    onChange={(value) => updateWorkExperience(exp.id, { endDate: value })}
                    disabled={exp.current}
                  />

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`current-${exp.id}`}
                      checked={exp.current}
                      onCheckedChange={(checked) =>
                        updateWorkExperience(exp.id, { current: checked as boolean })
                      }
                    />
                    <label
                      htmlFor={`current-${exp.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Currently working here
                    </label>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <Label>Description</Label>
                      <AIWriterButton
                        fieldName="description"
                        fieldLabel="Work Experience Description"
                        fieldValue={exp.description || ''}
                        onUpdate={(newText) => updateWorkExperience(exp.id, { description: newText })}
                      />
                    </div>
                    <Textarea
                      value={exp.description}
                      onChange={(e) => updateWorkExperience(exp.id, { description: e.target.value })}
                      placeholder="• Led development of key features&#10;• Improved performance by 50%"
                      rows={4}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </AnimatePresence>

      {resumeData.workExperience.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-8">
          No work experience added yet. Click "Add Experience" to get started.
        </p>
      )}
    </motion.div>
  );
};
