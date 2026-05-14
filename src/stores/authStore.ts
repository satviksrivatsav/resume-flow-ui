import { Session, User } from '@supabase/supabase-js';
import { create } from 'zustand';

import { supabase } from '@/lib/supabase';

interface Profile {
  id: string;
  name: string | null;
  username: string | null;
  theme: string;     // 'light' | 'dark' | 'system'
  language: string;  // BCP-47, e.g. 'en'
}

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;

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
  isInitialized: false,

  initialize: async () => {
    if (get().isInitialized) return;

    console.log('[AuthStore] initialize: starting');
    try {
      // 1. Get initial session
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) throw error;

      console.log('[AuthStore] initialize: session found', !!session);

      set({
        session,
        user: session?.user ?? null,
        isInitialized: true,
      });

      if (session?.user) {
        await get().fetchProfile();
      }

      // Mark loading as done BEFORE registering the listener so that when
      // onAuthStateChange fires INITIAL_SESSION synchronously, the app is
      // already unblocked and won't get stuck in a perpetual loading state.
      set({ isLoading: false });

      // 2. Listen for ongoing auth changes (sign-in, sign-out, token refresh)
      supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('[AuthStore] onAuthStateChange:', event, !!session);

        const currentUser = get().user;
        const newUser = session?.user ?? null;

        // Always sync the latest session/user from Supabase
        set({ session, user: newUser });

        if (event === 'SIGNED_IN') {
          // Only re-fetch profile if the user identity actually changed, or
          // the profile hasn't been loaded yet (avoids a redundant fetch when
          // INITIAL_SESSION fires right after our own initialization above).
          if (newUser && (newUser.id !== currentUser?.id || !get().profile)) {
            console.log('[AuthStore] SIGNED_IN: fetching profile for', newUser.id);
            await promoteAnonymousResume(newUser.id);
            await get().fetchProfile();
          }
        }

        if (event === 'INITIAL_SESSION' && session?.user) {
          // Profile was already fetched during initialize(); only re-fetch if
          // somehow missing (e.g. fetchProfile failed earlier).
          if (!get().profile) {
            console.log('[AuthStore] INITIAL_SESSION: profile missing, re-fetching');
            await get().fetchProfile();
          }
        }

        if (event === 'SIGNED_OUT') {
          set({ profile: null });
        }
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Auth initialization failed';
      console.error('[AuthStore] initialize error:', message);
      set({ isLoading: false, isInitialized: true, error: message });
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
          redirectTo: `${window.location.origin}/dashboard`,
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

    console.log('[AuthStore] fetchProfile: fetching for', user.id);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle(); // Use maybeSingle to avoid errors if profile doesn't exist yet

      if (error) throw error;

      console.log('[AuthStore] fetchProfile: result', !!data);
      set({ profile: data });
    } catch (error: unknown) {
      console.error('[AuthStore] fetchProfile error:', error);
    }
  },

  updateProfile: async (updates) => {
    const { user } = get();
    if (!user) return { error: 'No user found' };

    set({ isLoading: true, error: null });
    try {
      // Use upsert so the call succeeds even if a profile row doesn't exist yet
      // (e.g. for users created before the profiles table migration).
      const { data, error } = await supabase
        .from('profiles')
        .upsert(
          { id: user.id, ...updates, updated_at: new Date().toISOString() },
          { onConflict: 'id' },
        )
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
