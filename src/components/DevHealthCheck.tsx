import React, { useEffect, useState } from 'react';
import { checkSupabaseConnection } from '../utils/healthCheck';
import { supabase } from '../config/supabaseClient';

export const DevHealthCheck: React.FC = () => {
  const [output, setOutput] = useState<string[]>([]);

  const log = (msg: string) => {
    console.info('[DevHealth]', msg);
    setOutput(s => [msg, ...s].slice(0, 20));
  };

  useEffect(() => {
    let mounted = true;
    
    const runHealthCheck = async () => {
      if (!mounted) return;
      
      log(`DEV HEALTH - starting checks at ${new Date().toISOString()}`);

      try {
        // 1) Simple Supabase session check
        try {
          const sessionRes = await supabase.auth.getSession();
          if (!mounted) return;
          log(`supabase.auth.getSession() -> ${sessionRes?.data?.session ? 'Session exists' : 'No session'}`);
          if ((sessionRes as any).error) log(`getSession error: ${(sessionRes as any).error?.message}`);
        } catch (err: any) {
          if (!mounted) return;
          log(`getSession threw: ${String(err.message || err)}`);
        }

        // 2) Lightweight DB check via helper (ONE TIME ONLY)
        try {
          const hc = await checkSupabaseConnection();
          if (!mounted) return;
          log(`checkSupabaseConnection -> ok=${hc.ok} message=${hc.message ?? 'none'} latency=${hc.latency ?? 'n/a'}ms`);
        } catch (err: any) {
          if (!mounted) return;
          log(`health check threw: ${String(err.message || err)}`);
        }
        
        if (mounted) {
          log(`Health check completed successfully`);
        }
      } catch (err: any) {
        if (!mounted) return;
        log(`Unexpected error: ${String(err.message || err)}`);
      }
    };

    runHealthCheck();
    
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="fixed right-4 bottom-4 w-96 max-h-64 overflow-auto bg-neutral-900/80 border border-neutral-800 rounded-lg p-3 text-xs z-50">
      <div className="flex items-center justify-between mb-2">
        <strong className="text-white">Dev Health</strong>
        <span className="text-neutral-400">{new Date().toLocaleTimeString()}</span>
      </div>
      <div className="text-neutral-300">
        {output.length === 0 && <div>Running checks...</div>}
        {output.map((line, idx) => (
          <div key={idx} className="truncate">{line}</div>
        ))}
      </div>
    </div>
  );
};
