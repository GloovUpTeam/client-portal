import React from 'react';
import { Project } from '../../types';
import { Calendar, MoreVertical, ChevronRight } from 'lucide-react';
import { ProgressBar } from '../molecules/ProgressBar';

interface ProjectCardProps {
  project: Project;
  onClick: (id: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const statusColors = {
    'Active': 'bg-brand/20 text-brand',
    'Paused': 'bg-yellow-500/20 text-yellow-500',
    'Completed': 'bg-blue-500/20 text-blue-500',
    'Review': 'bg-purple-500/20 text-purple-500',
  };

  return (
    <div 
      onClick={() => onClick(project.id)}
      className="group bg-brand-surface rounded-xl border border-neutral-800 p-5 hover:border-brand/50 transition-all cursor-pointer shadow-lg hover:shadow-brand/5"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[project.status]}`}>
             {project.status}
           </span>
           <h3 className="mt-2 text-lg font-bold text-white group-hover:text-brand transition-colors">{project.name}</h3>
           <p className="text-sm text-neutral-400">{project.client}</p>
        </div>
        <button className="text-neutral-500 hover:text-white">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <div className="mb-6">
        <ProgressBar value={project.progress} label="Progress" />
      </div>

      <div className="flex items-center justify-between border-t border-neutral-800 pt-4">
        <div className="flex -space-x-2">
          {project.team.map((user) => (
            <img 
              key={user.id}
              className="w-8 h-8 rounded-full border-2 border-brand-surface"
              src={user.avatar}
              alt={user.name}
              title={user.name}
            />
          ))}
        </div>
        
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <Calendar className="w-4 h-4" />
          <span>{new Date(project.dueDate).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};