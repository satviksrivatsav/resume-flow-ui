import { motion } from 'framer-motion';
import { ChevronDown, Languages } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrashAnimatedIcon } from '@/components/ui/TrashAnimatedIcon';
import { useResumeStore } from '@/stores/resumeStore';
import { SectionListManager } from './shared/SectionListManager';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

export const LanguagesForm = () => {
  const { resumeData, addItem, updateItem, deleteItem } = useResumeStore();
  const { items: languages } = resumeData.sections.languages;

  const defaultNewItem = (id: string) => ({
    id,
    name: '',
    description: '',
    level: 0,
    visible: true,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <SectionListManager
        items={languages}
        onAdd={(newItem) => addItem('languages', newItem)}
        defaultNewItem={defaultNewItem}
        addButtonLabel="Add Language"
        emptyMessage="Add the languages you know to broaden your profile's appeal."
        renderItem={(lang, index, isExpanded) => (
          <AccordionItem
            key={lang.id}
            value={lang.id}
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
                    {lang.name || `Language ${index + 1}`}
                  </h3>
                  {lang.description && (
                    <p className="text-sm text-muted-foreground mt-0.5 font-medium">
                      {lang.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 ml-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteItem('languages', lang.id);
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
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="font-medium">
                    Language Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={lang.name}
                    onChange={(e) => updateItem('languages', lang.id, { name: e.target.value })}
                    placeholder="e.g. English, Spanish, Japanese"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-medium">Fluency / Proficiency</Label>
                  <Input
                    value={lang.description}
                    onChange={(e) =>
                      updateItem('languages', lang.id, { description: e.target.value })
                    }
                    placeholder="e.g. Native, Professional Working, Conversational"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      />
    </motion.div>
  );
};


