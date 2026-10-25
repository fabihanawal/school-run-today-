// Supabase client stub - in-memory mock for AI Studio environment
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://ablgzkhyhcyepwfttrya.supabase.co';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

export const supabase = {
  url: supabaseUrl,
  anonKey: supabaseAnonKey,
  from: () => ({
    select: async () => ({ data: [], error: null }),
    insert: async () => ({ data: null, error: null }),
    update: async () => ({ data: null, error: null }),
    delete: async () => ({ data: null, error: null }),
  }),
  auth: {
    getUser: async () => ({ data: { user: null }, error: null }),
    signInWithPassword: async () => ({ data: { user: null }, error: null }),
    signOut: async () => ({ error: null }),
  },
};
