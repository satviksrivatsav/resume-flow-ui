import { useResumeStore } from "@/stores/resumeStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { GraduationCap, Plus, ChevronDown, ChevronUp, Calendar } from "lucide-react";
import { TrashAnimatedIcon } from "@/components/ui/TrashAnimatedIcon";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { MonthYearPicker } from "@/components/ui/MonthYearPicker";
import { cn } from "@/lib/utils";

export const EducationForm = () => {
  const { resumeData, addEducation, updateEducation, deleteEducation } = useResumeStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (resumeData.education.length > 0 && !expandedId) {
      setExpandedId(resumeData.education[resumeData.education.length - 1].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeData.education]);

  const handleAdd = () => {
    addEducation();
    setTimeout(() => {
      const lastEdu = resumeData.education[resumeData.education.length - 1];
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
          {resumeData.education.map((edu, index) => {
            const isExpanded = expandedId === edu.id;

            return (
              <motion.div
                key={edu.id}
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
                  onClick={() => setExpandedId(isExpanded ? null : edu.id)}
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base truncate">
                      {edu.degree ? `${edu.degree}${edu.field ? ` in ${edu.field}` : ''}` : `Education ${index + 1}`}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                      {edu.school && (
                        <span className="flex items-center gap-1.5 font-medium text-foreground/80">
                          <GraduationCap className="w-3.5 h-3.5" />
                          {edu.school}
                        </span>
                      )}
                      {(edu.startDate || edu.endDate) && (
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {edu.startDate || "Start"} — {edu.endDate || "End"}
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
Field of Study</Label>
                          <Input
                            value={edu.field}
                            onChange={(e) => updateEducation(edu.id, { field: e.target.value })}
                            placeholder="e.g. Computer Science"
                          />
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                          <MonthYearPicker
                            label={<span>Start Date <span className="text-red-500">*</span></span>}
                            value={edu.startDate}
                            onChange={(value) => updateEducation(edu.id, { startDate: value })}
                          />
                          <MonthYearPicker
                            label={<span>End Date <span className="text-red-500">*</span></span>}
                            value={edu.endDate}
                            onChange={(value) => updateEducation(edu.id, { endDate: value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="font-medium">
Grade / GPA <span className="text-red-500">*</span></Label>
                          <Input
                            value={edu.grade}
                            onChange={(e) => updateEducation(edu.id, { grade: e.target.value })}
                            placeholder="e.g. 3.8/4.0"
                          />
                        </div>

                        <div className="md:col-span-2 space-y-3">
                          <Label className="text-sm font-semibold">Description / Achievements</Label>
                          <Textarea
                            value={edu.description}
                            onChange={(e) => updateEducation(edu.id, { description: e.target.value })}
                            placeholder="• Relevant coursework: Data Structures, Algorithms&#10;• Dean's List for 4 semesters"
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

      {resumeData.education.length === 0 && (
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
