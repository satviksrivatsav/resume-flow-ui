/**
 * Application Configuration
 * Centralized environment variables and fallbacks
 */

export const config = {
  // AI and Parser Backend
  parserApiUrl: import.meta.env.VITE_PARSER_API_URL || 'http://localhost:8000',
  aiApiUrl: import.meta.env.VITE_AI_API_URL || 'http://localhost:8000/api/v1',

  // Supabase Configuration
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key',
  },

  // Feature Flags or other settings can go here
  isDevelopment: import.meta.env.MODE === 'development',
  isProduction: import.meta.env.MODE === 'production',
};

export default config;
