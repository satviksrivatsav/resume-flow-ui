import { render, screen } from '@testing-library/react';
import { FeaturePreview } from '../FeaturePreview';
import { describe, it, expect } from 'vitest';

describe('FeaturePreview', () => {
  it('renders correctly for a specific feature', () => {
    render(<FeaturePreview activeFeature="ai" />);
    expect(screen.getByTestId('feature-preview')).toBeDefined();
  });
});
