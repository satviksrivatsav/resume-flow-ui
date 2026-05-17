import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Mail, Phone, Plus, User, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AIWriterButton } from '@/components/ui/AIWriterButton';
import { RichTextEditor } from '@/components/ui/RichTextEditor';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrashAnimatedIcon } from '@/components/ui/TrashAnimatedIcon';
import { cn } from '@/lib/utils';
import { useResumeStore } from '@/stores/resumeStore';

export const ReferencesForm = () => {
  const { resumeData, addItem, updateItem, deleteItem } = useResumeStore();
  const { items: references } = resumeData.sections.references;
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (references.length > 0 && !expandedId) {
      setExpandedId(references[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const handleAdd = () => {
    const id = uuidv4();
    addItem('references', { id, name: '', position: '', phone: '', email: '', description: '' });
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
          Provide professional references who can vouch for your work and character.
        </p>
        <Button onClick={handleAdd} className="gap-2 shadow-sm">
          <Plus className="w-4 h-4" />
          Add Reference
        </Button>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {references.map((ref, index) => {
            const isExpanded = expandedId === ref.id;

            return (
              <motion.div
                key={ref.id}
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
                  onClick={() => setExpandedId(isExpanded ? null : ref.id)}
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base truncate">
                      {ref.name || `Reference ${index + 1}`}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                      {ref.position && (
                        <span className="flex items-center gap-1.5 font-medium text-foreground/80">
                          <User className="w-3.5 h-3.5" />
                          {ref.position}
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
                          deleteItem('references', ref.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-500 hover:bg-red-500/10 h-10 w-10"
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
                            Name <span className="text-red-500">*</span>
                          </Label>
                          <div className="relative">
                            <Input
                              value={ref.name}
                              onChange={(e) =>
                                updateItem('references', ref.id, { name: e.target.value })
                              }
                              placeholder="e.g. Jane Smith"
                              className="pl-9"
                            />
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="font-medium">Position / Relationship</Label>
                          <Input
                            value={ref.position}
                            onChange={(e) =>
                              updateItem('references', ref.id, { position: e.target.value })
                            }
                            placeholder="e.g. Manager at Previous Co"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="font-medium">
                            Email <span className="text-foreground/50">*</span>
                          </Label>
                          <div className="relative">
                            <Input
                              value={ref.email}
                              onChange={(e) =>
                                updateItem('references', ref.id, { email: e.target.value })
                              }
                              placeholder="e.g. jane@example.com"
                              className="pl-9"
                            />
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="font-medium">
                            Phone <span className="text-foreground/50">*</span>
                          </Label>
                          <div className="relative">
                            <Input
                              value={ref.phone}
                              onChange={(e) =>
                                updateItem('references', ref.id, { phone: e.target.value })
                              }
                              placeholder="e.g. +1 234 567 890"
                              className="pl-9"
                            />
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          </div>
                        </div>

                        <div className="md:col-span-2">
                          <p className="text-xs text-muted-foreground">
                            * At least one contact method (Email or Phone) is required.
                          </p>
                        </div>

                        <div className="md:col-span-2 space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="font-medium">Summary / Context</Label>
                            <AIWriterButton
                              fieldName="references"
                              fieldLabel="Reference"
                              fieldValue={ref.description || ''}
                              onUpdate={(newText) =>
                                updateItem('references', ref.id, { description: newText })
                              }
                            />
                          </div>
                          <RichTextEditor
                            value={ref.description || ''}
                            onChange={(value) =>
                              updateItem('references', ref.id, { description: value })
                            }
                            placeholder="Briefly describe how you worked together or what they can speak to."
                            className="min-h-[80px]"
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

      {references.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/20">
          <div className="bg-background w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Users className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="font-medium text-lg">No references added</h3>
          <p className="text-muted-foreground max-w-[250px] mx-auto mt-1 mb-6">
            Help employers verify your history with trusted professional contacts.
          </p>
          <Button onClick={handleAdd} variant="outline" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Reference
          </Button>
        </div>
      )}
    </motion.div>
  );
};
