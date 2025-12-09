import React from 'react';
import { TicketSummary } from '../../mocks/dashboardMocks';
import { Ticket, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DateRange } from './DateRangeFilter';

interface Props {
  summary: TicketSummary;
  dateRange?: DateRange;
}

export const DashboardTicketsSummaryCard: React.FC<Props> = ({ summary, dateRange }) => {
  return (
    <div className="bg-brand-surface p-6 rounded-xl border border-neutral-800">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-neutral-800 rounded-lg text-brand">
          <Ticket className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold text-white">Tickets</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold text-white">{summary.totalOpen}</p>
            <p className="text-sm text-neutral-400 mt-1">Open tickets</p>
          </div>
          
          {summary.highPriority > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span className="text-sm font-semibold text-red-400">
                {summary.highPriority} High Priority
              </span>
            </div>
          )}
        </div>
        
        <Link
          to="/tickets"
          className="block w-full text-center py-2 text-sm text-brand font-medium hover:text-white transition-colors border border-neutral-800 rounded-lg hover:bg-neutral-800"
        >
          View All Tickets
        </Link>
      </div>
    </div>
  );
};
