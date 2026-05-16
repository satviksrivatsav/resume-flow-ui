import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { AIWriterButton } from '@/components/ui/AIWriterButton';
import { RichTextEditor } from '@/components/ui/RichTextEditor';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TrashAnimatedIcon } from '@/components/ui/TrashAnimatedIcon';
import { useResumeStore } from '@/stores/resumeStore';
import { useUiStore } from '@/stores/uiStore';

export const CustomSectionForm = () => {
  const { resumeData, updateCustomSection, deleteCustomSection } = useResumeStore();
  const { activeTab, setActiveTab } = useUiStore();

  const section = resumeData.customSections.find((s) => s.id === activeTab);

  if (!section) return null;

  const handleAddItem = () => {
    const newItem = { id: uuidv4(), title: '', description: '', visible: true };
    updateCustomSection(section.id, { items: [...section.items, newItem] });
  };

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
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
        <Button onClick={handleAddItem} className="gap-2 rounded-full">
          <Plus className="w-4 h-4" /> Add Item
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {section.items.map((item: any) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group relative border rounded-xl p-6 bg-card hover:border-primary/30 transition-all duration-200 shadow-sm"
            >
              <div className="absolute top-4 right-4">
                <motion.div whileHover="hover" whileTap="tap">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteItem(item.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-500 hover:bg-red-500/10 h-10 w-10"
                  >
                    <TrashAnimatedIcon className="w-4 h-4" />
                  </Button>
                </motion.div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-medium">Title</Label>
                  <Input
                    value={item.title}
                    onChange={(e) => handleUpdateItem(item.id, { title: e.target.value })}
                    placeholder="e.g. Project Title, Achievement Name"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="font-medium">Description</Label>
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
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {section.items.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/20">
          <h3 className="font-medium text-lg">Empty Section</h3>
          <p className="text-muted-foreground max-w-[250px] mx-auto mt-1 mb-6">
            Click 'Add Item' to start building out this custom section.
          </p>
          <Button onClick={handleAddItem} variant="outline" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Item
          </Button>
        </div>
      )}
    </motion.div>
  );
};
