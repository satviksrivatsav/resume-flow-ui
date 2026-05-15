import { createClient } from '@supabase/supabase-js';

import { config } from '@/config/config';

const { url, anonKey } = config.supabase;

if (!url || !anonKey) {
  console.warn('Supabase credentials not configured. Auth features will not work.');
}

export const supabase = createClient(url, anonKey);
