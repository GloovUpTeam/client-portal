import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket } from '../../types';
import { MessageSquare, Clock } from 'lucide-react';

interface Props {
  ticket: Ticket & { messages: number };
}

export const TicketCard: React.FC<Props> = ({ ticket }) => {
  const navigate = useNavigate();

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'Critical':
        return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'High':
        return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'Medium':
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      default:
        return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    }
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'Open':
        return 'bg-blue-500/20 text-blue-400';
      case 'In Progress':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'Resolved':
        return 'bg-green-500/20 text-green-400';
      case 'Closed':
        return 'bg-neutral-700 text-neutral-400';
      default:
        return 'bg-neutral-800 text-neutral-300';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      onClick={() => navigate(`/tickets/${ticket.id}`)}
      className="bg-brand-surface border border-neutral-800 rounded-lg p-4 hover:border-brand transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-neutral-500">{ticket.id}</span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getPriorityColor(
                ticket.priority
              )}`}
            >
              {ticket.priority}
            </span>
          </div>
          <h3 className="text-white font-medium group-hover:text-brand transition-colors line-clamp-2">
            {ticket.title}
          </h3>
        </div>
        <span
          className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ml-2 ${getStatusColor(
            ticket.status
          )}`}
        >
          {ticket.status}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm text-neutral-400">
        <div className="flex items-center gap-4">
          {ticket.assignee && (
            <div className="flex items-center gap-1.5">
              <img
                src={ticket.assignee.avatar}
                className="w-5 h-5 rounded-full"
                alt={ticket.assignee.name}
              />
              <span className="text-xs">{ticket.assignee.name}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <MessageSquare className="w-4 h-4" />
            <span className="text-xs">{ticket.messages}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <Clock className="w-3 h-3" />
          {formatDate(ticket.createdDate)}
        </div>
      </div>
    </div>
  );
};
