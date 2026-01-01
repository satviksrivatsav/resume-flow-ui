import { useResumeStore } from "@/stores/resumeStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { GraduationCap, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { AIWriterButton } from "@/components/ui/AIWriterButton";

export const EducationForm = () => {
  const { resumeData, addEducation, updateEducation, deleteEducation } = useResumeStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (resumeData.education.length > 0) {
      setExpandedId(resumeData.education[resumeData.education.length - 1].id);
    }
  }, [resumeData.education]);

  const handleAdd = () => {
    addEducation();
    // Auto-expand the newly added item
    if (resumeData.education.length > 0) {
      // Will be handled by useEffect
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-lg border p-6 space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Education</h2>
        </div>
        <Button onClick={handleAdd} size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Add Education
        </Button>
      </div>

      <AnimatePresence mode="popLayout">
        {resumeData.education.map((edu, index) => (
          <motion.div
            key={edu.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border rounded-lg p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <button
                onClick={() => setExpandedId(expandedId === edu.id ? null : edu.id)}
                className="text-left flex-1"
              >
                <h3 className="font-medium">
                  {edu.degree || `Education ${index + 1}`}
                </h3>
                {edu.school && (
                  <p className="text-sm text-muted-foreground">{edu.school}</p>
                )}
              </button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteEducation(edu.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <AnimatePresence>
              {expandedId === edu.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div className="space-y-2">
                    <Label>School/University *</Label>
                    <Input
                      value={edu.school}
                      onChange={(e) => updateEducation(edu.id, { school: e.target.value })}
                      placeholder="MIT"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Degree *</Label>
                    <Input
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                      placeholder="Bachelor of Science"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Field of Study *</Label>
                    <Input
                      value={edu.field}
                      onChange={(e) => updateEducation(edu.id, { field: e.target.value })}
                      placeholder="Computer Science"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>GPA</Label>
                    <Input
                      value={edu.gpa}
                      onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                      placeholder="3.8/4.0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Start Date *</Label>
                    <Input
                      type="month"
                      value={edu.startDate}
                      onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>End Date *</Label>
                    <Input
                      type="month"
                      value={edu.endDate}
                      onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                    />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <Label>Description</Label>
                      <AIWriterButton
                        fieldName="description"
                        fieldLabel="Education Description"
                        fieldValue={edu.description || ''}
                        onUpdate={(newText) => updateEducation(edu.id, { description: newText })}
                      />
                    </div>
                    <Textarea
                      value={edu.description}
                      onChange={(e) => updateEducation(edu.id, { description: e.target.value })}
                      placeholder="Relevant coursework, achievements, honors..."
                      rows={3}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </AnimatePresence>

      {resumeData.education.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-8">
          No education added yet. Click "Add Education" to get started.
        </p>
      )}
    </motion.div>
  );
};
