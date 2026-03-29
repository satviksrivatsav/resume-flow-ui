import { useResumeStore } from "@/stores/resumeStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sparkles, Plus, Trash2, Wrench } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TechChipsInput } from "@/components/ui/TechChipsInput";

export const SkillsForm = () => {
  const { resumeData, addSkill, updateSkill, deleteSkill } = useResumeStore();

  const handleAdd = () => {
    addSkill();
  };

  const handleSkillsChange = (id: string, techs: string[]) => {
    updateSkill(id, { items: techs.join(", ") });
  };

  const getSkillsArray = (items: string) => {
    if (!items) return [];
    return items.split(",").map(s => s.trim()).filter(Boolean);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-muted-foreground">
          Group your skills into categories like "Languages", "Frameworks", or "Tools".
        </p>
        <Button onClick={handleAdd} className="gap-2 shadow-sm">
          <Plus className="w-4 h-4" />
          Add Skill Category
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {resumeData.skills.map((skill, index) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group relative border rounded-xl p-6 bg-card hover:border-primary/30 transition-all duration-200 shadow-sm"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteSkill(skill.id)}
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-10 w-10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>

              <div className="space-y-6">
                <div className="space-y-2 max-w-md">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category Name *</Label>
                  <Input
                    value={skill.category}
                    onChange={(e) => updateSkill(skill.id, { category: e.target.value })}
                    placeholder="e.g. Programming Languages, Tools, Soft Skills"
                    className="font-medium"
                  />
                </div>

                <TechChipsInput
                  label="Skills"
                  value={getSkillsArray(skill.items)}
                  onChange={(techs) => handleSkillsChange(skill.id, techs)}
                  placeholder="Type a skill and press Enter"
                  required
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {resumeData.skills.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/20">
          <div className="bg-background w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Sparkles className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="font-medium text-lg">No skills added</h3>
          <p className="text-muted-foreground max-w-[250px] mx-auto mt-1 mb-6">
            Categorize your expertise to help recruiters quickly scan your profile.
          </p>
          <Button onClick={handleAdd} variant="outline" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Skill Category
          </Button>
        </div>
      )}
    </motion.div>
  );
};

