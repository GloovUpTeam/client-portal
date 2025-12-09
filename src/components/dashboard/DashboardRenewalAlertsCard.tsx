import React from 'react';
import { Renewal } from '../../mocks/dashboardMocks';
import { Server, Globe, ExternalLink, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { DateRange } from './DateRangeFilter';

interface Props {
  renewals: Renewal[];
  dateRange?: DateRange;
}

const getDaysRemaining = (dateString: string): number => {
  const targetDate = new Date(dateString);
  const today = new Date();
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const getStatusColor = (daysLeft: number): { bg: string; text: string; label: string } => {
  if (daysLeft <= 7) return { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Urgent' };
  if (daysLeft <= 30) return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Soon' };
  return { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Active' };
};

export const DashboardRenewalAlertsCard: React.FC<Props> = ({ renewals }) => {
  const navigate = useNavigate();

  const handleCreateTicket = (renewal: Renewal, statusLabel: string) => {
    navigate('/tickets/new', {
      state: {
        renewalData: {
          type: renewal.type,
          name: renewal.name,
          renewDate: renewal.renewDate,
          urgency: statusLabel,
        }
      }
    });
  };

  return (
    <div className="bg-brand-surface p-6 rounded-xl border border-neutral-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-neutral-800 rounded-lg text-brand">
            <Server className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Renewal Alerts</h3>
        </div>
        <Link
          to="/profile"
          className="text-sm text-brand hover:text-white transition-colors flex items-center gap-1"
          aria-label="Manage renewal alerts (open profile)"
        >
          <span>Manage</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
      
      <div className="space-y-3">
        {renewals.map((renewal) => {
          const daysLeft = getDaysRemaining(renewal.renewDate);
          const status = getStatusColor(daysLeft);
          const formattedDate = new Date(renewal.renewDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          });

          return (
            <div
              key={renewal.id}
              className="flex items-center justify-between p-3 rounded-lg border border-neutral-800 hover:bg-neutral-900 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="text-neutral-400">
                  {renewal.type === 'domain' ? (
                    <Globe className="w-4 h-4" />
                  ) : (
                    <Server className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{renewal.name}</p>
                  <p className="text-xs text-neutral-500">{formattedDate} · {daysLeft} days</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${status.bg} ${status.text} font-medium`}
                  aria-label={`Renewal status: ${status.label}`}
                >
                  {status.label}
                </span>
                <button
                  onClick={() => handleCreateTicket(renewal, status.label)}
                  className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                  title="Create Ticket"
                  aria-label={`Create ticket for ${renewal.name}`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
