import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/components/ui/accordion';
import { AIWriterButton } from '@/shared/components/ui/AIWriterButton';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { RichTextEditor } from '@/shared/components/ui/RichTextEditor';
import { TrashAnimatedIcon } from '@/shared/components/ui/TrashAnimatedIcon';
import { cn } from '@/shared/lib/utils';
import { useResumeStore } from '@/shared/stores/resumeStore';
import { useUiStore } from '@/shared/stores/uiStore';

import { SectionListManager } from './shared/SectionListManager';

export const CustomSectionForm = () => {
  const { resumeData, updateCustomSection } = useResumeStore();
  const { activeTab } = useUiStore();

  const section = resumeData.customSections.find((s) => s.id === activeTab);

  if (!section) return null;

  const handleUpdateItem = (itemId: string, data: any) => {
    const updatedItems = section.items.map((item: any) =>
      item.id === itemId ? { ...item, ...data } : item,
    );
    updateCustomSection(section.id, { items: updatedItems });
  };

  const handleDeleteItem = (itemId: string) => {
    const updatedItems = section.items.filter((item: any) => item.id !== itemId);
    updateCustomSection(section.id, { items: updatedItems });
  };

  const defaultNewItem = (id: string) => ({
    id,
    title: '',
    description: '',
    visible: true,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="space-y-1">
          <Label className="font-medium text-xs text-muted-foreground uppercase tracking-wider">
            Section Name
          </Label>
          <Input
            value={section.name}
            onChange={(e) => updateCustomSection(section.id, { name: e.target.value })}
            className="text-lg font-bold border-none bg-transparent p-0 focus-visible:ring-0 h-auto"
            placeholder="Untitled Section"
          />
        </div>
      </div>

      <SectionListManager
        items={section.items}
        onAdd={(newItem) => updateCustomSection(section.id, { items: [...section.items, newItem] })}
        defaultNewItem={defaultNewItem}
        addButtonLabel="Add Item"
        emptyMessage="Click 'Add Item' to start building out this custom section."
        renderItem={(item, index, isExpanded) => (
          <AccordionItem
            key={item.id}
            value={item.id}
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
                    {item.title || `Item ${index + 1}`}
                  </h3>
                </div>
                <div className="flex items-center gap-1 ml-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteItem(item.id);
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
                    Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={item.title}
                    onChange={(e) => handleUpdateItem(item.id, { title: e.target.value })}
                    placeholder="e.g. Project Title, Achievement Name"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="font-medium">
                      Description <span className="text-destructive">*</span>
                    </Label>
                    <AIWriterButton
                      fieldName="custom"
                      fieldLabel={section.name}
                      fieldValue={item.description || ''}
                      onUpdate={(newText) => handleUpdateItem(item.id, { description: newText })}
                    />
                  </div>
                  <RichTextEditor
                    value={item.description || ''}
                    onChange={(value) => handleUpdateItem(item.id, { description: value })}
                    placeholder="Describe this item in detail..."
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
