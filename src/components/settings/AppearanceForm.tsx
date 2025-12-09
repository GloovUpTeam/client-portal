// src/components/settings/AppearanceForm.tsx
import React from 'react';
import { Palette } from 'lucide-react';

export const AppearanceForm: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white border-b border-neutral-800 pb-4">
          Appearance
        </h2>
        <p className="text-sm text-neutral-400 mt-2">
          Customize the look and feel of your workspace.
        </p>
      </div>

      <div className="text-center py-16">
        <Palette className="w-16 h-16 mx-auto mb-4 text-neutral-600" />
        <h3 className="text-lg font-semibold text-white mb-2">
          Theme Customization Coming Soon
        </h3>
        <p className="text-neutral-500 max-w-md mx-auto">
          We're working on bringing you custom themes, color schemes, and layout options. 
          Stay tuned for updates!
        </p>
      </div>
    </div>
  );
};
