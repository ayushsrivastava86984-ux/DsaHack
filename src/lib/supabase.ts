import { createClient } from '@supabase/supabase-js';

// Safe environment accessor supporting both Vite (import.meta.env) and Node (process.env)
const getEnvVar = (key: string): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    return String(import.meta.env[key]);
  }
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return String(process.env[key]);
  }
  return '';
};

// Resolve Supabase project URL and anon/publishable key
const rawUrl = (getEnvVar('VITE_SUPABASE_URL') || 'https://glptbmbodfvlafzwfyfm.supabase.co').trim();
const supabaseUrl = rawUrl.startsWith('http://') || rawUrl.startsWith('https://')
  ? rawUrl
  : `https://${rawUrl}.supabase.co`;

const supabaseAnonKey = (
  getEnvVar('VITE_SUPABASE_ANON_KEY') || 'sb_publishable_z6nfZYSWHWf3Qj4-Pw_c2w_N-Tq_1T9'
).trim();

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[DsaHack] Supabase URL or Anon/Publishable Key is missing. Check your environment variables.'
  );
}

// Reusable Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export interface ConnectionTestResult {
  connected: boolean;
  url: string;
  message: string;
  latencyMs?: number;
}

/**
 * Diagnostic helper to test connectivity to the configured Supabase instance
 * without requiring any pre-created tables.
 */
export async function testSupabaseConnection(): Promise<ConnectionTestResult> {
  const startTime = Date.now();
  try {
    // 1. Test Auth service
    const { error: authError } = await supabase.auth.getSession();
    if (authError) {
      return {
        connected: false,
        url: supabaseUrl,
        message: `Supabase auth check returned error: ${authError.message}`,
        latencyMs: Date.now() - startTime,
      };
    }

    // 2. Ping PostgREST endpoint (PGRST205 confirms PostgREST authenticated the request)
    const { error: restError } = await supabase.from('_connection_probe').select('*').limit(1);
    if (restError && restError.code !== 'PGRST205' && restError.code !== '42P01') {
      if (restError.message?.toLowerCase().includes('apikey') || restError.message?.toLowerCase().includes('jwt')) {
        return {
          connected: false,
          url: supabaseUrl,
          message: `Supabase PostgREST error: ${restError.message}`,
          latencyMs: Date.now() - startTime,
        };
      }
    }

    const latencyMs = Date.now() - startTime;
    return {
      connected: true,
      url: supabaseUrl,
      message: 'Successfully connected to Supabase project (Auth & PostgREST endpoints responsive).',
      latencyMs,
    };
  } catch (err: unknown) {
    const latencyMs = Date.now() - startTime;
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      connected: false,
      url: supabaseUrl,
      message: `Failed to connect to Supabase: ${errorMsg}`,
      latencyMs,
    };
  }
}
