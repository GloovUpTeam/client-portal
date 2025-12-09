import React from 'react';
import { TeamMember } from '../../types/user';
import { Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DateRange } from './DateRangeFilter';

interface Props {
  team: TeamMember[];
  dateRange?: DateRange;
}

export const DashboardTeamAssignedCard: React.FC<Props> = ({ team, dateRange }) => {
  // Filter team members by joinedAt if dateRange is provided
  const filteredTeam = dateRange 
    ? team.filter(m => m.joinedAt >= dateRange.start && m.joinedAt <= dateRange.end)
    : team;

  const maxVisible = 4;
  const visibleTeam = filteredTeam.slice(0, maxVisible);
  const remainingCount = filteredTeam.length - maxVisible;

  return (
    <div className="bg-brand-surface p-6 rounded-xl border border-neutral-800">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-neutral-800 rounded-lg text-brand">
          <Users className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold text-white">Team Assigned</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          {visibleTeam.map((member) => (
            <Link
              key={member.id}
              to={member.profileUrl || '#'}
              className="group relative"
              title={member.name}
            >
              <img
                src={member.avatar || 'https://picsum.photos/id/1005/200'}
                alt={member.name}
                className="w-10 h-10 rounded-full border-2 border-neutral-800 group-hover:border-brand transition-colors"
              />
            </Link>
          ))}
          
          {remainingCount > 0 && (
            <div className="w-10 h-10 rounded-full bg-neutral-800 border-2 border-neutral-700 flex items-center justify-center">
              <span className="text-xs font-semibold text-brand">+{remainingCount}</span>
            </div>
          )}
        </div>
        
        <div className="text-sm text-neutral-400">
          {team.length} team {team.length === 1 ? 'member' : 'members'} assigned
        </div>
      </div>
    </div>
  );
};
