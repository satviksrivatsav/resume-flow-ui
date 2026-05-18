import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FeaturePreview } from '../FeaturePreview';

describe('FeaturePreview', () => {
  it('renders correctly for a specific feature', () => {
    render(<FeaturePreview activeFeature="ai" />);
    expect(screen.getByTestId('feature-preview')).toBeDefined();
  });
});
