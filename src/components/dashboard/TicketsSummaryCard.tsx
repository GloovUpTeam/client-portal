import React from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTicketsForClient } from '../../services/ticketsService';
import { supabase } from '../../config/supabaseClient';
import { AlertCircle, Clock } from 'lucide-react';
import { DateRange } from './DateRangeFilter';

interface Props {
  dateRange?: DateRange;
}

export const TicketsSummaryCard: React.FC<Props> = ({ dateRange }) => {
  const navigate = useNavigate();
  const [summary, setSummary] = React.useState<any>({ totalOpen: 0, highPriority: 0, latest: [] });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadData = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
            setLoading(false);
            return;
        }
        
        const { data } = await fetchTicketsForClient(session.user.id);
        if (data) {
            const openTickets = data.filter(t => t.status !== 'Closed' && t.status !== 'Resolved');
            const highPriority = data.filter(t => t.priority === 'High' || t.priority === 'Critical').length;
            const latest = data.slice(0, 3);
            
            setSummary({
                totalOpen: openTickets.length,
                highPriority,
                latest
            });
        }
        setLoading(false);
    };
    loadData();
  }, []);

  if (loading) return <div className="p-6 bg-brand-surface border border-neutral-800 rounded-xl">Loading...</div>;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'text-red-500';
      case 'High':
        return 'text-orange-500';
      case 'Medium':
        return 'text-yellow-500';
      default:
        return 'text-blue-500';
    }
  };

  return (
    <div className="bg-brand-surface border border-neutral-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-white">Tickets Summary</h2>
        <button
          onClick={() => navigate('/tickets')}
          className="text-sm text-brand hover:text-brand-dark transition-colors font-medium"
        >
          View All
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-neutral-900 rounded-lg p-4">
          <div className="flex items-center gap-2 text-neutral-400 mb-1">
            <Clock className="w-4 h-4" />
            <span className="text-xs">Open</span>
          </div>
          <p className="text-2xl font-bold text-white">{summary.totalOpen}</p>
        </div>
        <div className="bg-neutral-900 rounded-lg p-4">
          <div className="flex items-center gap-2 text-neutral-400 mb-1">
            <AlertCircle className="w-4 h-4" />
            <span className="text-xs">High Priority</span>
          </div>
          <p className="text-2xl font-bold text-orange-500">{summary.highPriority}</p>
        </div>
      </div>

      {/* Latest Tickets */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-neutral-400 mb-3">Recent Tickets</h3>
        {(summary.latest || []).map((ticket: any) => (
          <div
            key={ticket.id}
            onClick={() => navigate(`/tickets/${ticket.id}`)}
            className="flex items-center justify-between p-3 bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer group"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate group-hover:text-brand transition-colors">
                {ticket.title}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-mono text-neutral-500">{ticket.id}</span>
                <span className={`text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority}
                </span>
              </div>
            </div>
            <span className="text-xs text-neutral-500 ml-2">{ticket.status}</span>
          </div>
        ))}
      </div>

      {(summary.latest || []).length === 0 && (
        <div className="text-center py-4">
          <p className="text-sm text-neutral-500">No recent tickets</p>
        </div>
      )}
    </div>
  );
};
