import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

export type DateRange = {
  start: string;
  end: string;
  label: string;
};

interface DateRangeFilterProps {
  onChange: (range: DateRange) => void;
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('Last 30 days');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const presets = [
    { label: 'Today', days: 0 },
    { label: 'Last 7 days', days: 7 },
    { label: 'Last 30 days', days: 30 },
    { label: 'This Month', type: 'month' },
  ];

  const handlePresetClick = (preset: any) => {
    const end = new Date();
    const start = new Date();

    if (preset.type === 'month') {
      start.setDate(1);
    } else {
      start.setDate(end.getDate() - preset.days);
    }

    const range = {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0],
      label: preset.label,
    };

    setSelectedLabel(preset.label);
    onChange(range);
    setIsOpen(false);
  };

  const handleCustomApply = () => {
    if (customStart && customEnd) {
      const range = {
        start: customStart,
        end: customEnd,
        label: 'Custom Range',
      };
      setSelectedLabel('Custom Range');
      onChange(range);
      setIsOpen(false);
    }
  };

  // Initialize with default
  useEffect(() => {
    handlePresetClick(presets[2]); // Last 30 days
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-white hover:border-brand transition-colors"
        aria-label="Date range"
      >
        <Calendar className="w-4 h-4 text-neutral-400" />
        <span>{selectedLabel}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-brand-surface border border-neutral-800 rounded-xl shadow-xl z-50 p-4">
          <div className="space-y-2 mb-4">
            {presets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => handlePresetClick(preset)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedLabel === preset.label
                    ? 'bg-brand/10 text-brand'
                    : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="border-t border-neutral-800 pt-4">
            <p className="text-xs font-medium text-neutral-500 mb-2">Custom Range</p>
            <div className="space-y-2">
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-xs text-white"
                aria-label="Start date"
              />
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-xs text-white"
                aria-label="End date"
              />
              <button
                onClick={handleCustomApply}
                disabled={!customStart || !customEnd}
                className="w-full mt-2 bg-brand text-black text-xs font-medium py-2 rounded hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
