import { Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/shared/components/ui/button';
import { Accordion } from '@/shared/components/ui/accordion';
import { AnimatePresence, motion } from 'framer-motion';

interface SectionListManagerProps<T extends { id: string }> {
  items: T[];
  onAdd: (newItem: T) => void;
  renderItem: (
    item: T,
    index: number,
    isExpanded: boolean,
    onExpand: (id: string) => void
  ) => React.ReactNode;
  defaultNewItem: (id: string) => T;
  addButtonLabel?: string;
  emptyMessage?: string;
}

export function SectionListManager<T extends { id: string }>({
  items,
  onAdd,
  renderItem,
  defaultNewItem,
  addButtonLabel = 'Add Item',
  emptyMessage = 'No items added yet.',
}: SectionListManagerProps<T>) {
  const [expandedId, setExpandedId] = useState<string | undefined>(
    items.length > 0 ? items[0].id : undefined
  );

  // Handle initial expansion when items load asynchronously
  useEffect(() => {
    if (items.length > 0 && !expandedId) {
      setExpandedId(items[0].id);
    }
  }, [items, expandedId]);

  const handleAdd = () => {
    const id = uuidv4();
    const newItem = defaultNewItem(id);
    onAdd(newItem);
    setExpandedId(id);
  };

  return (
    <div className="space-y-4">
      {items.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-border/50 rounded-xl">
          {emptyMessage}
        </div>
      ) : (
        <Accordion
          type="single"
          collapsible
          value={expandedId}
          onValueChange={setExpandedId}
          className="space-y-4"
        >
          <AnimatePresence mode="popLayout">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                {renderItem(item, index, expandedId === item.id, setExpandedId)}
              </motion.div>
            ))}
          </AnimatePresence>
        </Accordion>
      )}

      <Button
        onClick={handleAdd}
        variant="outline"
        className="w-full h-12 border-dashed border-2 hover:border-primary/50 hover:bg-primary/5 transition-all"
      >
        <Plus className="w-4 h-4 mr-2" />
        {addButtonLabel}
      </Button>
    </div>
  );
}
