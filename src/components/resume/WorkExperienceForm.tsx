import { useResumeStore } from "@/stores/resumeStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Briefcase, Plus, ChevronDown, ChevronUp, MapPin, Calendar } from "lucide-react";
import { TrashAnimatedIcon } from "@/components/ui/TrashAnimatedIcon";
import { AIWriterButton } from "@/components/ui/AIWriterButton";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { MonthYearPicker } from "@/components/ui/MonthYearPicker";
import { cn } from "@/lib/utils";
import { FieldTip } from "@/components/ui/FieldTip";

export const WorkExperienceForm = () => {
  const { resumeData, addWorkExperience, updateWorkExperience, deleteWorkExperience } = useResumeStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (resumeData.workExperience.length > 0 && !expandedId) {
      setExpandedId(resumeData.workExperience[resumeData.workExperience.length - 1].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeData.workExperience]);

  const handleAdd = () => {
    addWorkExperience();
    setTimeout(() => {
      const lastExp = resumeData.workExperience[resumeData.workExperience.length - 1];
      if (lastExp) setExpandedId(lastExp.id);
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
          Add your relevant work history, starting with your most recent role.
        </p>
        <Button onClick={handleAdd} className="gap-2 shadow-sm">
          <Plus className="w-4 h-4" />
          Add Experience
        </Button>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {resumeData.workExperience.map((exp, index) => {
            const isExpanded = expandedId === exp.id;
            
            return (
              <motion.div
                key={exp.id}
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
                  onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-base truncate">
                        {exp.position || `Work Experience ${index + 1}`}
                      </h3>
                      {exp.current && (
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
                      {(exp.startDate || exp.endDate) && (
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {exp.startDate || "Start"} — {exp.current ? "Present" : (exp.endDate || "End")}
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
                          deleteWorkExperience(exp.id);
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
                        <div className="space-y-2">
                          <Label className="font-medium">
                            Position <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            value={exp.position}
                            onChange={(e) => updateWorkExperience(exp.id, { position: e.target.value })}
                            placeholder="e.g. Senior Software Engineer"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="font-medium">
                            Company Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            value={exp.company}
                            onChange={(e) => updateWorkExperience(exp.id, { company: e.target.value })}
                            placeholder="e.g. Google"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="font-medium">Location</Label>
                          <div className="relative">
                            <Input
                              value={exp.location}
                              onChange={(e) => updateWorkExperience(exp.id, { location: e.target.value })}
                              placeholder="e.g. San Francisco, CA"
                              className="pl-9"
                            />
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                          <MonthYearPicker
                            label={<span>Start Date <span className="text-red-500">*</span></span>}
                            value={exp.startDate}
                            onChange={(value) => updateWorkExperience(exp.id, { startDate: value })}
                          />

                          <div className="space-y-2">
                            <MonthYearPicker
                              label={<span>End Date {!exp.current && <span className="text-red-500">*</span>}</span>}
                              value={exp.endDate}
                              onChange={(value) => updateWorkExperience(exp.id, { endDate: value })}
                              disabled={exp.current}
                            />
                          </div>
                        </div>

                        <div className="md:col-span-2 flex items-center space-x-2 bg-muted/30 p-3 rounded-2xl border border-dashed">
                          <Checkbox
                            id={`current-${exp.id}`}
                            checked={exp.current}
                            onCheckedChange={(checked) =>
                              updateWorkExperience(exp.id, { current: checked as boolean })
                            }
                          />
                          <label
                            htmlFor={`current-${exp.id}`}
                            className="text-sm font-medium leading-none cursor-pointer select-none"
                          >
                            I am currently working in this role
                          </label>
                        </div>

                        <div className="md:col-span-2 space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-semibold">Key Achievements & Responsibilities</Label>
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
                            placeholder="• Led a team of 5 developers to ship X feature&#10;• Improved app performance by 40% through Y optimization"
                            className="min-h-[150px] font-mono text-sm"
                            rows={6}
                          />
                          <FieldTip>
                            Use bullet points and lead with strong action verbs. Quantify impact where possible — e.g., "Reduced load time by 40%" or "Shipped feature used by 10k users."
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

      {resumeData.workExperience.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/20">
          <div className="bg-background w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Briefcase className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="font-medium text-lg">No experience yet</h3>
          <p className="text-muted-foreground max-w-[250px] mx-auto mt-1 mb-6">
            Add your professional history to show employers your journey.
          </p>
          <Button onClick={handleAdd} variant="outline" className="gap-2">
            <Plus className="w-4 h-4" />
            Add your first role
          </Button>
        </div>
      )}
    </motion.div>
  );
};
