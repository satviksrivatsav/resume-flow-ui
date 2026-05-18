import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Calendar, ChevronDown, ChevronUp, Link as LinkIcon, Plus } from 'lucide-react';
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

export const PublicationsForm = () => {
  const { resumeData, addItem, updateItem, deleteItem } = useResumeStore();
  const { items: publications } = resumeData.sections.publications;
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (publications.length > 0 && !expandedId) {
      setExpandedId(publications[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const handleAdd = () => {
    const id = uuidv4();
    addItem('publications', {
      id,
      name: '',
      publisher: '',
      date: '',
      description: '',
      website: { label: '', href: '' },
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
          List your published articles, books, or research papers.
        </p>
        <Button onClick={handleAdd} className="gap-2 shadow-sm">
          <Plus className="w-4 h-4" />
          Add Publication
        </Button>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {publications.map((pub, index) => {
            const isExpanded = expandedId === pub.id;

            return (
              <motion.div
                key={pub.id}
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
                  onClick={() => setExpandedId(isExpanded ? null : pub.id)}
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base truncate">
                      {pub.name || `Publication ${index + 1}`}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                      {pub.publisher && (
                        <span className="flex items-center gap-1.5 font-medium text-foreground/80">
                          <BookOpen className="w-3.5 h-3.5" />
                          {pub.publisher}
                        </span>
                      )}
                      {pub.date && (
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {pub.date}
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
                          deleteItem('publications', pub.id);
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
                            Title <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            value={pub.name}
                            onChange={(e) =>
                              updateItem('publications', pub.id, { name: e.target.value })
                            }
                            placeholder="e.g. Exploring AI in Modern Web Apps"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="font-medium">
                            Publisher / Journal <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            value={pub.publisher}
                            onChange={(e) =>
                              updateItem('publications', pub.id, { publisher: e.target.value })
                            }
                            placeholder="e.g. Tech Journal, Medium"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="font-medium">Date</Label>
                          <div className="relative">
                            <Input
                              value={pub.date}
                              onChange={(e) =>
                                updateItem('publications', pub.id, { date: e.target.value })
                              }
                              placeholder="e.g. 2023-01"
                              className="pl-9"
                            />
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="font-medium">Publication URL</Label>
                          <div className="relative">
                            <Input
                              value={pub.website.href}
                              onChange={(e) =>
                                updateItem('publications', pub.id, {
                                  website: { ...pub.website, href: e.target.value },
                                })
                              }
                              placeholder="e.g. https://journal.com/..."
                              className="pl-9"
                            />
                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          </div>
                        </div>

                        <div className="md:col-span-2 space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="font-medium">Description</Label>
                            <AIWriterButton
                              fieldName="publications"
                              fieldLabel="Publication"
                              fieldValue={pub.description || ''}
                              onUpdate={(newText) =>
                                updateItem('publications', pub.id, { description: newText })
                              }
                            />
                          </div>
                          <RichTextEditor
                            value={pub.description || ''}
                            onChange={(value) =>
                              updateItem('publications', pub.id, { description: value })
                            }
                            placeholder="Briefly explain the publication's topic or impact."
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

      {publications.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/20">
          <div className="bg-background w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <BookOpen className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="font-medium text-lg">No publications added</h3>
          <p className="text-muted-foreground max-w-[250px] mx-auto mt-1 mb-6">
            Add your written work to demonstrate your expertise and thought leadership.
          </p>
          <Button onClick={handleAdd} variant="outline" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Publication
          </Button>
        </div>
      )}
    </motion.div>
  );
};

