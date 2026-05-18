import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Plus, Wrench } from 'lucide-react';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TechChipsInput } from '@/components/ui/TechChipsInput';
import { TrashAnimatedIcon } from '@/components/ui/TrashAnimatedIcon';
import { cn } from '@/lib/utils';
import { useResumeStore } from '@/stores/resumeStore';

export const SkillsForm = () => {
  const { resumeData, addItem, updateSkill, deleteSkill } = useResumeStore();
  const { items: skills } = resumeData.sections.skills;
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (skills.length > 0 && !expandedId) {
      setExpandedId(skills[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const handleAdd = () => {
    const id = uuidv4();
    addItem('skills', {
      id,
      name: '',
      keywords: [],
      level: 0,
      visible: true,
      description: '',
    });
    setExpandedId(id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
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

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {skills.map((skill, index) => {
            const isExpanded = expandedId === skill.id;

            return (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
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
                  onClick={() => setExpandedId(isExpanded ? null : skill.id)}
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base truncate">
                      {skill.name || `Skill Category ${index + 1}`}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                      {skill.keywords.length > 0 && (
                        <span className="flex items-center gap-1.5 font-medium text-foreground/80">
                          <Wrench className="w-3.5 h-3.5" />
                          {skill.keywords.length} Skills
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
                          deleteSkill(skill.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-10 w-10"
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
                        <div className="space-y-2 max-w-md">
                          <Label className="font-medium">
                            Category Name <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            value={skill.name}
                            onChange={(e) => updateSkill(skill.id, { name: e.target.value })}
                            placeholder="e.g. Programming Languages, Tools, Soft Skills"
                            className="font-medium"
                          />
                        </div>

                        <TechChipsInput
                          label="Skills"
                          value={skill.keywords}
                          onChange={(techs) => updateSkill(skill.id, { keywords: techs })}
                          placeholder="Type a skill and press Enter"
                          required
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {skills.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/20">
          <div className="bg-background w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Wrench className="w-6 h-6 text-muted-foreground" />
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

