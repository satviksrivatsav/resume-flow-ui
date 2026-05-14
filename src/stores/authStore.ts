import { Session, User } from '@supabase/supabase-js';
import { create } from 'zustand';

import { supabase } from '@/lib/supabase';

interface Profile {
  id: string;
  name: string | null;
  username: string | null;
  theme: string;
  language: string;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
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
  fetchProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error?: string }>;
  updateEmail: (email: string) => Promise<{ error?: string }>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  profile: null,
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

      if (session?.user) {
        await get().fetchProfile();
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        set({
          session,
          user: session?.user ?? null,
          profile: session?.user ? get().profile : null,
        });

        if (event === 'SIGNED_IN' && session?.user) {
          await promoteAnonymousResume(session.user.id);
          await get().fetchProfile();
        }

        if (event === 'SIGNED_OUT') {
          set({ profile: null });
        }
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

      if (data.user) {
        await promoteAnonymousResume(data.user.id);
        await get().fetchProfile();
      }

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

      if (data.user) {
        await promoteAnonymousResume(data.user.id);
        await get().fetchProfile();
      }

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
        profile: null,
        isLoading: false,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Sign out failed';
      set({ isLoading: false, error: message });
    }
  },

  fetchProfile: async () => {
    const { user } = get();
    if (!user) return;

    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();

      if (error) throw error;

      set({ profile: data });
    } catch (error: unknown) {
      console.error('Error fetching profile:', error);
    }
  },

  updateProfile: async (updates) => {
    const { user } = get();
    if (!user) return { error: 'No user found' };

    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      set({ profile: data, isLoading: false });
      return {};
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Update profile failed';
      set({ isLoading: false, error: message });
      return { error: message };
    }
  },

  updateEmail: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.auth.updateUser({ email });
      if (error) throw error;

      set({ isLoading: false });
      return {};
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Update email failed';
      set({ isLoading: false, error: message });
      return { error: message };
    }
  },

  clearError: () => set({ error: null }),
}));

const promoteAnonymousResume = async (userId: string) => {
  const anonymousResume = sessionStorage.getItem('rf-anonymous-resume');
  if (anonymousResume) {
    try {
      const resumeData = JSON.parse(anonymousResume);
      const upsertData: any = {
        user_id: userId,
        name: resumeData.name || 'Untitled Resume',
        data: resumeData,
        updated_at: new Date().toISOString(),
      };

      if (resumeData.id) {
        upsertData.id = resumeData.id;
      }

      const { error } = await supabase.from('resumes').upsert(upsertData);

      if (error) throw error;

      sessionStorage.removeItem('rf-anonymous-resume');
    } catch (error) {
      console.error('Error promoting anonymous resume:', error);
    }
  }
};
