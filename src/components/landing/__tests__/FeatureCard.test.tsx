// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { FeatureCard } from '../FeatureCard';
import { Sparkles } from 'lucide-react';
import { describe, it, expect } from 'vitest';

describe('FeatureCard', () => {
  it('renders title and description', () => {
    render(
      <FeatureCard
        title="AI Assistant"
        description="Test description"
        icon={Sparkles}
        isActive={false}
        onClick={() => {}}
      />
    );
    expect(screen.getByText('AI Assistant')).toBeDefined();
    expect(screen.getByText('Test description')).toBeDefined();
  });
});
