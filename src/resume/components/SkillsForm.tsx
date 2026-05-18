import { motion } from 'framer-motion';
import { ChevronDown, Wrench } from 'lucide-react';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/components/ui/accordion';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { TechChipsInput } from '@/shared/components/ui/TechChipsInput';
import { TrashAnimatedIcon } from '@/shared/components/ui/TrashAnimatedIcon';
import { cn } from '@/shared/lib/utils';
import { useResumeStore } from '@/shared/stores/resumeStore';

import { SectionListManager } from './shared/SectionListManager';

export const SkillsForm = () => {
  const { resumeData, addItem, updateSkill, deleteSkill } = useResumeStore();
  const { items: skills } = resumeData.sections.skills;

  const defaultNewItem = (id: string) => ({
    id,
    name: '',
    keywords: [],
    level: 0,
    visible: true,
    description: '',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <SectionListManager
        items={skills}
        onAdd={(newItem) => addItem('skills', newItem)}
        defaultNewItem={defaultNewItem}
        addButtonLabel="Add Skill Category"
        emptyMessage="Group your skills into categories like 'Languages', 'Frameworks', or 'Tools'."
        renderItem={(skill, index, isExpanded) => (
          <AccordionItem
            key={skill.id}
            value={skill.id}
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
                  <div className="text-muted-foreground p-1">
                    <ChevronDown
                      className={cn(
                        'w-5 h-5 transition-transform duration-200',
                        isExpanded && 'rotate-180',
                      )}
                    />
                  </div>
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent className="p-0">
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
            </AccordionContent>
          </AccordionItem>
        )}
      />
    </motion.div>
  );
};
