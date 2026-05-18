import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, ChevronDown, ChevronUp, Plus, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AIWriterButton } from '@/components/ui/AIWriterButton';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import { TrashAnimatedIcon } from '@/components/ui/TrashAnimatedIcon';
import { cn } from '@/lib/utils';
import { useResumeStore } from '@/stores/resumeStore';

export const AwardsForm = () => {
  const { resumeData, addItem, updateItem, deleteItem } = useResumeStore();
  const { items: awards } = resumeData.sections.awards;
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (awards.length > 0 && !expandedId) {
      setExpandedId(awards[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const handleAdd = () => {
    const id = uuidv4();
    addItem('awards', { id, title: '', awarder: '', date: '', description: '' });
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
          List your professional awards, honors, and recognitions.
        </p>
        <Button onClick={handleAdd} className="gap-2 shadow-sm">
          <Plus className="w-4 h-4" />
          Add Award
        </Button>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {awards.map((award, index) => {
            const isExpanded = expandedId === award.id;

            return (
              <motion.div
                key={award.id}
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
                  onClick={() => setExpandedId(isExpanded ? null : award.id)}
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
                    <motion.div whileHover="hover" whileTap="tap">
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {awards.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/20">
          <div className="bg-background w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Trophy className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="font-medium text-lg">No awards added</h3>
          <p className="text-muted-foreground max-w-[250px] mx-auto mt-1 mb-6">
            Highlight your achievements and standing in your field.
          </p>
          <Button onClick={handleAdd} variant="outline" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Award
          </Button>
        </div>
      )}
    </motion.div>
  );
};

