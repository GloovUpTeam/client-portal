// src/components/ui/Toggle.tsx
import React from 'react';

export interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({ 
  enabled, 
  onChange, 
  label, 
  description,
  disabled = false 
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-neutral-900/50 rounded-lg border border-neutral-800">
      <div className="flex-1">
        {label && <span className="text-sm font-medium text-neutral-300">{label}</span>}
        {description && <p className="text-xs text-neutral-500 mt-1">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        disabled={disabled}
        onClick={() => !disabled && onChange(!enabled)}
        className={`
          relative inline-flex h-6 w-12 items-center rounded-full transition-colors
          focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-brand-surface
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${enabled ? 'bg-brand' : 'bg-neutral-700'}
        `}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition-transform
            ${enabled ? 'translate-x-7' : 'translate-x-1'}
          `}
        />
      </button>
    </div>
  );
};
