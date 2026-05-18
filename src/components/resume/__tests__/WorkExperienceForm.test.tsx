/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { WorkExperienceForm } from '../WorkExperienceForm';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';

// Mock the store
vi.mock('@/stores/resumeStore', () => ({
  useResumeStore: () => ({
    resumeData: {
      sections: {
        experience: {
          items: [
            {
              id: '1',
              company: 'Test Company',
              position: 'Test Position',
              location: 'Test Location',
              period: '2020-2021',
              description: 'Test Description',
              visible: true,
            },
          ],
        },
      },
    },
    addItem: vi.fn(),
    updateExperience: vi.fn(),
    deleteExperience: vi.fn(),
  }),
}));

// Mock components that might be complex
vi.mock('@/components/ui/AIWriterButton', () => ({
  AIWriterButton: () => <button>AI Writer</button>,
}));
vi.mock('@/components/ui/RichTextEditor', () => ({
  RichTextEditor: () => <div>Rich Text Editor</div>,
}));

describe('WorkExperienceForm', () => {
  it('renders correctly with items', () => {
    render(<WorkExperienceForm />);
    
    expect(screen.getByText('Test Position')).toBeDefined();
    expect(screen.getByText('Test Company')).toBeDefined();
  });
});
