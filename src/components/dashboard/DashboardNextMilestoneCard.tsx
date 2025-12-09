import React from 'react';
import { Milestone } from '../../mocks/dashboardMocks';
import { Calendar, Clock } from 'lucide-react';
import { DateRange } from './DateRangeFilter';

interface Props {
  milestone?: Milestone;
  dateRange?: DateRange;
}

const getDaysRemaining = (dateString: string): number => {
  const targetDate = new Date(dateString);
  const today = new Date();
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const DashboardNextMilestoneCard: React.FC<Props> = ({ milestone }) => {
  if (!milestone) {
    return (
      <div className="bg-brand-surface p-6 rounded-xl border border-neutral-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-neutral-800 rounded-lg text-neutral-500">
            <Calendar className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Next Milestone</h3>
        </div>
        <div className="text-center py-8">
          <p className="text-neutral-400">No upcoming milestones</p>
        </div>
      </div>
    );
  }

  const daysLeft = getDaysRemaining(milestone.date);
  const isUrgent = daysLeft <= 7;
  const formattedDate = new Date(milestone.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="bg-brand-surface p-6 rounded-xl border border-neutral-800">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-neutral-800 rounded-lg text-brand">
          <Calendar className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold text-white">Next Milestone</h3>
      </div>
      
      <div className="space-y-3">
        <h4 className="text-xl font-semibold text-white">{milestone.title}</h4>
        
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <Clock className="w-4 h-4" />
          <span>{formattedDate}</span>
        </div>
        
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${
          isUrgent ? 'bg-red-500/20 text-red-400' : 'bg-brand/20 text-brand'
        }`}>
          <span className="font-semibold">{daysLeft} days left</span>
        </div>
      </div>
    </div>
  );
};
