import React, { useState, useEffect } from 'react';
import { Clock as ClockIcon } from 'lucide-react';

export const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) return null; // Prevent hydration mismatch if SSR (though this is SPA)

  return (
    <div className="flex items-center gap-2 text-neutral-400 text-sm font-mono bg-neutral-900/50 px-3 py-1.5 rounded-full border border-white/5">
      <ClockIcon className="w-3 h-3" />
      <span>
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
};
