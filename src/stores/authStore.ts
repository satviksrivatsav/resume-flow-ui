import { Session, User } from '@supabase/supabase-js';
import { create } from 'zustand';

import { supabase } from '@/lib/supabase';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  initialize: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<{ error?: string }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signInWithProvider: (provider: 'google' | 'github' | 'linkedin_oidc') => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string; message?: string }>;
  updatePassword: (password: string) => Promise<{ error?: string; message?: string }>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isLoading: true,
  error: null,

  initialize: async () => {
    try {
      // Get initial session
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) throw error;

      set({
        session,
        user: session?.user ?? null,
        isLoading: false,
      });

      // Listen for auth changes
      supabase.auth.onAuthStateChange((_event, session) => {
        set({
          session,
          user: session?.user ?? null,
        });
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Auth initialization failed';
      console.error('Auth initialization error:', message);
      set({ isLoading: false, error: message });
    }
  },

  signUp: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      set({
        user: data.user,
        session: data.session,
        isLoading: false,
      });

      return {};
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Sign up failed';
      set({ isLoading: false, error: message });
      return { error: message };
    }
  },

  signIn: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      set({
        user: data.user,
        session: data.session,
        isLoading: false,
      });

      return {};
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Sign in failed';
      set({ isLoading: false, error: message });
      return { error: message };
    }
  },

  signInWithProvider: async (provider) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/resume-builder`,
        },
      });

      if (error) throw error;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'OAuth sign in failed';
      set({ isLoading: false, error: message });
    }
  },

  resetPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) throw error;

      set({ isLoading: false });
      return { message: 'Check your email for the password reset link' };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Password reset failed';
      set({ isLoading: false, error: message });
      return { error: message };
    }
  },

  updatePassword: async (password) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;

      set({ isLoading: false });
      return { message: 'Password updated successfully' };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Password update failed';
      set({ isLoading: false, error: message });
      return { error: message };
    }
  },

  signOut: async () => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      set({
        user: null,
        session: null,
        isLoading: false,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Sign out failed';
      set({ isLoading: false, error: message });
    }
  },

  clearError: () => set({ error: null }),
}));
