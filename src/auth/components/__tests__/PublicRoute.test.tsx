/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAuthStore } from '@/shared/stores/authStore';

import { PublicRoute } from '../PublicRoute';

vi.mock('@/shared/stores/authStore', () => ({
  useAuthStore: vi.fn(),
}));

describe('PublicRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading spinner when auth is not initialized', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: null,
      isInitialized: false,
    } as any);

    render(
      <MemoryRouter>
        <PublicRoute>
          <div>Guest Content</div>
        </PublicRoute>
      </MemoryRouter>,
    );

    // Verify loader is shown and guest content is not rendered
    expect(screen.queryByText('Guest Content')).toBeNull();
    // Loader2 typically uses svg or elements with animation class
    expect(document.querySelector('.animate-spin')).toBeDefined();
  });

  it('renders children when user is not logged in', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: null,
      isInitialized: true,
    } as any);

    render(
      <MemoryRouter>
        <PublicRoute>
          <div>Guest Content</div>
        </PublicRoute>
      </MemoryRouter>,
    );

    expect(screen.getByText('Guest Content')).toBeDefined();
  });

  it('redirects to dashboard when user is logged in', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: { id: 'user-123', email: 'user@example.com' } as any,
      isInitialized: true,
    } as any);

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <div>LoggedIn Redirect Content</div>
              </PublicRoute>
            }
          />
          <Route path="/dashboard" element={<div>Dashboard Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    // Redirect content should not render
    expect(screen.queryByText('LoggedIn Redirect Content')).toBeNull();
    // Should be redirected to /dashboard
    expect(screen.getByText('Dashboard Page')).toBeDefined();
  });
});
