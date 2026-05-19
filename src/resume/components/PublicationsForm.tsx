import { motion } from 'framer-motion';
import { BookOpen, Calendar, ChevronDown, Link as LinkIcon } from 'lucide-react';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/components/ui/accordion';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { RichTextEditor } from '@/shared/components/ui/RichTextEditor';
import { TrashAnimatedIcon } from '@/shared/components/ui/TrashAnimatedIcon';
import { cn } from '@/shared/lib/utils';
import { useResumeStore } from '@/shared/stores/resumeStore';

import { SectionListManager } from './shared/SectionListManager';

export const PublicationsForm = () => {
  const { resumeData, addItem, updateItem, deleteItem } = useResumeStore();
  const { items: publications } = resumeData.sections.publications;

  const defaultNewItem = (id: string) => ({
    id,
    name: '',
    publisher: '',
    date: '',
    description: '',
    website: { label: '', href: '' },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <SectionListManager
        items={publications}
        onAdd={(newItem) => addItem('publications', newItem)}
        defaultNewItem={defaultNewItem}
        addButtonLabel="Add Publication"
        emptyMessage="List your published articles, books, or research papers."
        renderItem={(pub, index, isExpanded) => (
          <AccordionItem
            key={pub.id}
            value={pub.id}
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
                    Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={pub.name}
                    onChange={(e) => updateItem('publications', pub.id, { name: e.target.value })}
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
                      onChange={(e) => updateItem('publications', pub.id, { date: e.target.value })}
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
                  <Label className="font-medium">Description</Label>
                  <RichTextEditor
                    value={pub.description || ''}
                    onChange={(value) => updateItem('publications', pub.id, { description: value })}
                    placeholder="Briefly explain the publication's topic or impact."
                    className="min-h-[100px]"
                    showAIWriter={true}
                    aiFieldName="publications"
                    aiFieldValue={pub.description || ''}
                    onAiUpdate={(newText) =>
                      updateItem('publications', pub.id, { description: newText })
                    }
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
