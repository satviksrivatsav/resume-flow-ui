import { motion } from 'framer-motion';
import { Calendar, ChevronDown, Trophy } from 'lucide-react';
import { AIWriterButton } from '@/components/ui/AIWriterButton';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import { TrashAnimatedIcon } from '@/components/ui/TrashAnimatedIcon';
import { cn } from '@/lib/utils';
import { useResumeStore } from '@/stores/resumeStore';
import { SectionListManager } from './shared/SectionListManager';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export const AwardsForm = () => {
  const { resumeData, addItem, updateItem, deleteItem } = useResumeStore();
  const { items: awards } = resumeData.sections.awards;

  const defaultNewItem = (id: string) => ({
    id,
    title: '',
    awarder: '',
    date: '',
    description: '',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <SectionListManager
        items={awards}
        onAdd={(newItem) => addItem('awards', newItem)}
        defaultNewItem={defaultNewItem}
        addButtonLabel="Add Award"
        emptyMessage="List your professional awards, honors, and recognitions."
        renderItem={(award, index, isExpanded) => (
          <AccordionItem
            key={award.id}
            value={award.id}
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
                    {award.title || `Award ${index + 1}`}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                    {award.awarder && (
                      <span className="flex items-center gap-1.5 font-medium text-foreground/80">
                        <Trophy className="w-3.5 h-3.5" />
                        {award.awarder}
                      </span>
                    )}
                    {award.date && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {award.date}
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
                      deleteItem('awards', award.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-10 w-10"
                  >
                    <TrashAnimatedIcon className="w-4 h-4" />
                  </Button>
                  <div className="text-muted-foreground p-1">
                    <ChevronDown className={cn("w-5 h-5 transition-transform duration-200", isExpanded && "rotate-180")} />
                  </div>
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent className="p-0">
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="font-medium">
                    Award Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={award.title}
                    onChange={(e) =>
                      updateItem('awards', award.id, { title: e.target.value })
                    }
                    placeholder="e.g. Employee of the Month"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-medium">Awarder / Organization</Label>
                  <Input
                    value={award.awarder}
                    onChange={(e) =>
                      updateItem('awards', award.id, { awarder: e.target.value })
                    }
                    placeholder="e.g. Acme Corp"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-medium">Date</Label>
                  <div className="relative">
                    <Input
                      value={award.date}
                      onChange={(e) =>
                        updateItem('awards', award.id, { date: e.target.value })
                      }
                      placeholder="e.g. 2022-05"
                      className="pl-9"
                    />
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="font-medium">Description</Label>
                    <AIWriterButton
                      fieldName="awards"
                      fieldLabel="Award"
                      fieldValue={award.description || ''}
                      onUpdate={(newText) =>
                        updateItem('awards', award.id, { description: newText })
                      }
                    />
                  </div>
                  <RichTextEditor
                    value={award.description || ''}
                    onChange={(value) =>
                      updateItem('awards', award.id, { description: value })
                    }
                    placeholder="Briefly describe the award and why you received it."
                    className="min-h-[100px]"
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

