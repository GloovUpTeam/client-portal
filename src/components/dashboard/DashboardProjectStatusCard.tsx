import React from 'react';
import { Project } from '../../types/projects';
import { TrendingUp } from 'lucide-react';
import { DateRange } from './DateRangeFilter';

interface Props {
  project: Project;
  dateRange?: DateRange;
}

export const DashboardProjectStatusCard: React.FC<Props> = ({ project, dateRange }) => {
  if (!project) {
    return (
      <div className="bg-brand-surface p-6 rounded-xl border border-neutral-800">
        <div className="flex items-center justify-center h-full">
          <p className="text-neutral-400 text-sm">No active project found</p>
        </div>
      </div>
    );
  }

  // Simple filter stub: check if project was created or updated within range
  const isInRange = dateRange ? (
    (project.created_at >= dateRange.start && project.created_at <= dateRange.end) ||
    (project.updated_at >= dateRange.start && project.updated_at <= dateRange.end)
  ) : true;

  if (!isInRange) {
    return (
      <div className="bg-brand-surface p-6 rounded-xl border border-neutral-800 opacity-50">
        <p className="text-neutral-400 text-sm">No data for selected range</p>
      </div>
    );
  }

  return (
    <div className="bg-brand-surface p-6 rounded-xl border border-neutral-800">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white">{project.name}</h3>
          <p className="text-sm text-neutral-400 mt-1">Current Progress</p>
        </div>
        <div className="p-2 bg-neutral-800 rounded-lg text-brand">
          <TrendingUp className="w-5 h-5" />
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-white">{project.progress}%</span>
          <span className="text-xs text-neutral-500">Complete</span>
        </div>
        
        <div 
          className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden"
          role="progressbar"
          aria-valuenow={project.progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Project progress: ${project.progress}%`}
        >
          <div 
            className="bg-brand h-full rounded-full transition-all duration-500"
            style={{ width: `${project.progress}%` }}
          />
        </div>
        
        <div className="flex items-center gap-1 text-xs text-neutral-500">
          <span>●</span>
          <span className="text-brand">{(project.milestones || []).length} milestones</span>
        </div>
      </div>
    </div>
  );
};
