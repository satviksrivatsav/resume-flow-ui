import { create } from 'zustand';
import { User, Session } from '@supabase/supabase-js';
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
            const { data: { session }, error } = await supabase.auth.getSession();

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
        } catch (error: any) {
            console.error('Auth initialization error:', error);
            set({ isLoading: false, error: error.message });
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
        } catch (error: any) {
            set({ isLoading: false, error: error.message });
            return { error: error.message };
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
        } catch (error: any) {
            set({ isLoading: false, error: error.message });
            return { error: error.message };
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
        } catch (error: any) {
            set({ isLoading: false, error: error.message });
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
        } catch (error: any) {
            set({ isLoading: false, error: error.message });
            return { error: error.message };
        }
    },

    updatePassword: async (password) => {
        set({ isLoading: true, error: null });
        try {
            const { error } = await supabase.auth.updateUser({
                password
            });

            if (error) throw error;

            set({ isLoading: false });
            return { message: 'Password updated successfully' };
        } catch (error: any) {
            set({ isLoading: false, error: error.message });
            return { error: error.message };
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
        } catch (error: any) {
            set({ isLoading: false, error: error.message });
        }
    },

    clearError: () => set({ error: null }),
}));
