import { motion } from 'framer-motion';
import { ChevronDown, Heart } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TechChipsInput } from '@/components/ui/TechChipsInput';
import { TrashAnimatedIcon } from '@/components/ui/TrashAnimatedIcon';
import { useResumeStore } from '@/stores/resumeStore';
import { SectionListManager } from './shared/SectionListManager';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

export const InterestsForm = () => {
  const { resumeData, addItem, updateItem, deleteItem } = useResumeStore();
  const { items: interests } = resumeData.sections.interests;

  const defaultNewItem = (id: string) => ({
    id,
    name: '',
    keywords: [],
    visible: true,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <SectionListManager
        items={interests}
        onAdd={(newItem) => addItem('interests', newItem)}
        defaultNewItem={defaultNewItem}
        addButtonLabel="Add Interest"
        emptyMessage="Share what you're passionate about outside of work."
        renderItem={(interest, index, isExpanded) => (
          <AccordionItem
            key={interest.id}
            value={interest.id}
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
                    {interest.name || `Interest ${index + 1}`}
                  </h3>
                  {interest.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {interest.keywords.slice(0, 5).map((kw) => (
                        <span
                          key={kw}
                          className="px-2 py-0.5 text-[10px] bg-muted rounded-full text-muted-foreground"
                        >
                          {kw}
                        </span>
                      ))}
                      {interest.keywords.length > 5 && (
                        <span className="text-[10px] text-muted-foreground self-center ml-1">
                          +{interest.keywords.length - 5} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 ml-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteItem('interests', interest.id);
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
                <div className="space-y-2">
                  <Label className="font-medium">
                    Interest / Hobby <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={interest.name}
                    onChange={(e) => updateItem('interests', interest.id, { name: e.target.value })}
                    placeholder="e.g. Photography, Hiking, Open Source"
                  />
                </div>

                <TechChipsInput
                  label="Keywords"
                  value={interest.keywords}
                  onChange={(keywords) => updateItem('interests', interest.id, { keywords })}
                  placeholder="Type a tag and press Enter"
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      />
    </motion.div>
  );
};


