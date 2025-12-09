import React from 'react';
import { UserActivity } from '../../types/user';
import { Clock } from 'lucide-react';

interface RecentActivityProps {
  activities: UserActivity[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  return (
    <div className="bg-[#111] border border-white/5 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-brand" />
        <h3 className="text-lg font-bold text-white">Recent Activity</h3>
      </div>
      
      <div className="space-y-6">
        {activities.length === 0 ? (
          <p className="text-neutral-500 text-sm">No recent activity</p>
        ) : (
          activities.slice(0, 5).map((activity) => (
            <div key={activity.id} className="relative pl-6 border-l border-white/10 last:border-0">
              <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-neutral-800 border border-white/20" />
              <p className="text-sm text-white font-medium">{activity.action}</p>
              <p className="text-xs text-neutral-400 mt-0.5">{activity.target}</p>
              <p className="text-[10px] text-neutral-500 mt-1">
                {new Date(activity.timestamp).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
