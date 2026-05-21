// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { Sparkles } from 'lucide-react';
import { describe, expect, it } from 'vitest';

import { FeatureCard } from '../FeatureCard';

describe('FeatureCard', () => {
  it('renders title and description', () => {
    render(
      <FeatureCard
        title="AI Assistant"
        description="Test description"
        icon={Sparkles}
        isActive={false}
        onClick={() => undefined}
      />,
    );
    expect(screen.getByText('AI Assistant')).toBeDefined();
    expect(screen.getByText('Test description')).toBeDefined();
  });
});
