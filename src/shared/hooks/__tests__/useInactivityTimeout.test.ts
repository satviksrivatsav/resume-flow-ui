/**
 * @vitest-environment jsdom
 */
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useAuthStore } from '@/shared/stores/authStore';

import { useInactivityTimeout } from '../useInactivityTimeout';

vi.mock('@/shared/stores/authStore', () => ({
  useAuthStore: vi.fn(),
}));

describe('useInactivityTimeout', () => {
  let signOut: any;
  const session = { user: { id: '123' } };

  beforeEach(() => {
    signOut = vi.fn();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T12:00:00Z'));
    vi.mocked(useAuthStore).mockReturnValue({
      session,
      signOut,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('signs out when activity occurs AFTER the limit', () => {
    const { unmount } = renderHook(() => useInactivityTimeout());

    // Inactive for 1 hour + 1ms
    vi.advanceTimersByTime(60 * 60 * 1000 + 1);

    // Trigger activity
    act(() => {
      window.dispatchEvent(new MouseEvent('mousedown'));
    });

    expect(signOut).toHaveBeenCalled();
    unmount();
  });

  it('does NOT sign out when activity occurs BEFORE the limit', () => {
    const { unmount } = renderHook(() => useInactivityTimeout());

    // Inactive for 30 minutes
    vi.advanceTimersByTime(30 * 60 * 1000);

    // Trigger activity
    act(() => {
      window.dispatchEvent(new MouseEvent('mousedown'));
    });

    expect(signOut).not.toHaveBeenCalled();

    // Inactive for another 45 minutes
    vi.advanceTimersByTime(45 * 60 * 1000);

    act(() => {
      window.dispatchEvent(new MouseEvent('mousedown'));
    });

    expect(signOut).not.toHaveBeenCalled();
    unmount();
  });

  it('does nothing if no session', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      session: null,
      signOut,
    });

    const { unmount } = renderHook(() => useInactivityTimeout());

    vi.advanceTimersByTime(60 * 60 * 1000 + 1);

    act(() => {
      window.dispatchEvent(new MouseEvent('mousedown'));
    });

    expect(signOut).not.toHaveBeenCalled();
    unmount();
  });
});
