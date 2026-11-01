import { createClient, type SupabaseClient } from '@supabase/supabase-js';

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

// Clean and normalize project URL
const rawUrl = (
  getEnvVar('VITE_SUPABASE_URL') ||
  getEnvVar('SUPABASE_URL') ||
  'https://glptbmbodfvlafzwfyfm.supabase.co'
).trim();

export const supabaseUrl = (() => {
  let url = rawUrl;
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}.supabase.co`;
  }
  return url.replace(/\/+$/, ''); // Strip trailing slash
})();

// Anon / Publishable key (never use secret or service_role key here)
export const supabaseAnonKey = (
  getEnvVar('VITE_SUPABASE_ANON_KEY') ||
  getEnvVar('SUPABASE_ANON_KEY') ||
  'sb_publishable_z6nfZYSWHWf3Qj4-Pw_c2w_N-Tq_1T9'
).trim();

// Reusable Supabase client instance
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export interface ConnectionTestResult {
  connected: boolean;
  url: string;
  authStatus: 'connected' | 'failed';
  restStatus: 'connected' | 'failed';
  message: string;
  latencyMs: number;
  details?: Record<string, unknown>;
}

/**
 * Diagnostic helper to test connectivity to the configured Supabase instance
 * without modifying or requiring any pre-created tables or dummy data.
 */
export async function testSupabaseConnection(): Promise<ConnectionTestResult> {
  const startTime = Date.now();

  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      connected: false,
      url: supabaseUrl || 'NOT_CONFIGURED',
      authStatus: 'failed',
      restStatus: 'failed',
      message: 'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables.',
      latencyMs: 0,
    };
  }

  let authStatus: 'connected' | 'failed' = 'failed';
  let restStatus: 'connected' | 'failed' = 'failed';
  let authMessage = '';
  let restMessage = '';

  // 1. Test Auth service reachability
  try {
    const { error: authError } = await supabase.auth.getSession();
    if (authError) {
      authMessage = `Auth error: ${authError.message}`;
    } else {
      authStatus = 'connected';
    }
  } catch (err: unknown) {
    authMessage = `Auth endpoint unreachable: ${err instanceof Error ? err.message : String(err)}`;
  }

  // 2. Test PostgREST service reachability via schema cache probe (no tables touched)
  try {
    const { error: restError } = await supabase
      .from('_connection_probe')
      .select('*')
      .limit(1);

    // PGRST205 / 42P01 confirms the PostgREST server authenticated the key and inspected the schema cache
    if (!restError || restError.code === 'PGRST205' || restError.code === '42P01') {
      restStatus = 'connected';
    } else if (
      restError.message?.toLowerCase().includes('apikey') ||
      restError.message?.toLowerCase().includes('jwt') ||
      restError.code === 'PGRST301'
    ) {
      restMessage = `Invalid publishable API key: ${restError.message}`;
    } else {
      // Any response from PostgREST other than network error means server was reached
      restStatus = 'connected';
      restMessage = `PostgREST responded (${restError.code || 'HTTP error'}): ${restError.message}`;
    }
  } catch (err: unknown) {
    restMessage = `PostgREST endpoint unreachable: ${err instanceof Error ? err.message : String(err)}`;
  }

  const latencyMs = Date.now() - startTime;
  const connected = authStatus === 'connected' && restStatus === 'connected';

  let summaryMessage = '';
  if (connected) {
    summaryMessage = `Successfully connected to Supabase (${latencyMs}ms). Auth and PostgREST endpoints are healthy.`;
  } else {
    summaryMessage = [authMessage, restMessage].filter(Boolean).join(' | ') || 'Connection failed.';
  }

  return {
    connected,
    url: supabaseUrl,
    authStatus,
    restStatus,
    message: summaryMessage,
    latencyMs,
    details: {
      url: supabaseUrl,
      keyPrefix: supabaseAnonKey.slice(0, 15) + '...',
      authStatus,
      restStatus,
    },
  };
}

// Window augmentation for easy verification in DevTools Console on deployed sites
declare global {
  interface Window {
    testSupabaseConnection?: () => Promise<ConnectionTestResult>;
    supabase?: SupabaseClient;
  }
}

// Attach to window and run silent connection check on startup
if (typeof window !== 'undefined') {
  window.testSupabaseConnection = testSupabaseConnection;
  window.supabase = supabase;

  // Run async check in background and log status in console for instant verification
  testSupabaseConnection()
    .then((res) => {
      if (res.connected) {
        console.log(
          `%c[Supabase] Live connection verified (${res.latencyMs}ms)%c -> ${res.url}\nType %cawait window.testSupabaseConnection()%c in this console to inspect details.`,
          'color: #10b981; font-weight: bold;',
          'color: inherit;',
          'background: #1e293b; color: #38bdf8; padding: 2px 4px; border-radius: 4px; font-family: monospace;',
          'color: inherit;'
        );
      } else {
        console.warn(
          `%c[Supabase] Connection check warning:%c ${res.message}\nType %cawait window.testSupabaseConnection()%c to inspect.`,
          'color: #f59e0b; font-weight: bold;',
          'color: inherit;',
          'background: #1e293b; color: #38bdf8; padding: 2px 4px; border-radius: 4px; font-family: monospace;',
          'color: inherit;'
        );
      }
    })
    .catch((err) => {
      console.warn('[Supabase] Initial connection probe failed:', err);
    });
}
