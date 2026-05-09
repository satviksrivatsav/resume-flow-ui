/**
 * Application Configuration
 * Centralized environment variables and fallbacks
 */

export const config = {
  // AI and Parser Backend
  aiApiUrl: import.meta.env.VITE_AI_API_URL || 'http://localhost:8001/api/v1',

  // Supabase Configuration
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || 'https://znburrlaarxhwwivpgqr.supabase.co',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_xpdy54PWl3Jm1LaTf-Ps5w_YsiDNvll',
  },

  // Feature Flags or other settings can go here
  isDevelopment: import.meta.env.MODE === 'development',
  isProduction: import.meta.env.MODE === 'production',
};

export default config;
