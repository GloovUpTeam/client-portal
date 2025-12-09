import { supabase } from '../config/supabaseClient';

export const checkSupabaseConnection = async (): Promise<{ ok: boolean; message?: string; latency?: number }> => {
  const start = performance.now();
  try {
    // Create a timeout for the health check itself
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    // Simple query: just get the current user session or a lightweight query
    const { error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)
      .maybeSingle();
      // .abortSignal(controller.signal); // Not supported in this version of supabase-js?
    
    clearTimeout(timeoutId);
    const end = performance.now();
    const latency = Math.round(end - start);

    if (error) {
      console.warn('[Health] Supabase check failed:', error.message);
      return { ok: false, message: error.message, latency };
    }

    console.info(`[Health] Supabase connection OK (${latency}ms)`);
    return { ok: true, latency };
  } catch (err: any) {
    console.error('[Health] Unexpected error:', err);
    return { ok: false, message: err.message || 'Unknown error' };
  }
};
