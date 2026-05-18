import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Accordion } from '@/components/ui/accordion';

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

  const handleAdd = () => {
    const id = uuidv4();
    const newItem = defaultNewItem(id);
    onAdd(newItem);
    setExpandedId(id);
  };

  return (
    <div className="space-y-6">
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
          {items.map((item, index) =>
            renderItem(item, index, expandedId === item.id, setExpandedId)
          )}
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
