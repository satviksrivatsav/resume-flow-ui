/**
 * @vitest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { SectionListManager } from '../SectionListManager';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';

// Mock uuidv4
vi.mock('uuid', () => ({
  v4: () => 'test-uuid',
}));

interface TestItem {
  id: string;
  name: string;
}

describe('SectionListManager', () => {
  const items: TestItem[] = [
    { id: '1', name: 'Item 1' },
    { id: '2', name: 'Item 2' },
  ];

  const onAdd = vi.fn();
  const renderItem = (item: TestItem, index: number, isExpanded: boolean) => (
    <div key={item.id} data-testid={`item-${item.id}`}>
      {item.name} {isExpanded ? '(Expanded)' : ''}
    </div>
  );
  const defaultNewItem = (id: string) => ({ id, name: 'New Item' });

  it('renders items correctly', () => {
    render(
      <SectionListManager
        items={items}
        onAdd={onAdd}
        renderItem={renderItem}
        defaultNewItem={defaultNewItem}
      />
    );

    expect(screen.getByTestId('item-1')).toBeDefined();
    expect(screen.getByTestId('item-2')).toBeDefined();
    // First item should be expanded by default
    expect(screen.getByText('Item 1 (Expanded)')).toBeDefined();
  });

  it('calls onAdd when add button is clicked', () => {
    render(
      <SectionListManager
        items={[]}
        onAdd={onAdd}
        renderItem={renderItem}
        defaultNewItem={defaultNewItem}
        addButtonLabel="Add Test Item"
      />
    );

    const addButton = screen.getByText('Add Test Item');
    fireEvent.click(addButton);

    expect(onAdd).toHaveBeenCalledWith({ id: 'test-uuid', name: 'New Item' });
  });

  it('shows empty message when no items', () => {
    render(
      <SectionListManager
        items={[]}
        onAdd={onAdd}
        renderItem={renderItem}
        defaultNewItem={defaultNewItem}
        emptyMessage="No items yet"
      />
    );

    expect(screen.getByText('No items yet')).toBeDefined();
  });
});
