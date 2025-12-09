import React from 'react';
import { Renewal } from '../../types/invoices';
import { Calendar, AlertCircle, Globe, Server, Shield, Key } from 'lucide-react';
import { DateRange } from '../dashboard/DateRangeFilter';

interface RenewalRemindersCardProps {
  renewals?: Renewal[];
  dateRange?: DateRange;
}

export const RenewalRemindersCard: React.FC<RenewalRemindersCardProps> = ({ renewals = [], dateRange }) => {
  const expiringRenewals = renewals.filter((r) => r.status === 'Expiring');

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'domain':
        return <Globe className="w-4 h-4" />;
      case 'hosting':
        return <Server className="w-4 h-4" />;
      case 'service':
        return <Shield className="w-4 h-4" />;
      case 'license':
        return <Key className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getDaysUntilRenewal = (renewDate: string): number => {
    const today = new Date();
    const renew = new Date(renewDate);
    const diff = Math.ceil((renew.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="bg-brand-surface p-6 rounded-xl border border-neutral-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Renewal Reminders</h3>
        <AlertCircle className="w-6 h-6 text-orange-500" />
      </div>

      {expiringRenewals.length > 0 ? (
        <>
          <div className="mb-4">
            <div className="text-3xl font-bold text-white">{expiringRenewals.length}</div>
            <div className="text-sm text-neutral-400 mt-1">
              service{expiringRenewals.length !== 1 ? 's' : ''} expiring soon
            </div>
          </div>

          <div className="space-y-3">
            {expiringRenewals.map((renewal) => {
              const daysLeft = getDaysUntilRenewal(renewal.renewDate);
              const isUrgent = daysLeft <= 7;

              return (
                <div
                  key={renewal.id}
                  className={`p-3 rounded-lg border ${
                    isUrgent ? 'bg-red-500/10 border-red-500/20' : 'bg-yellow-500/10 border-yellow-500/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2">
                      <div className={`mt-0.5 ${isUrgent ? 'text-red-500' : 'text-yellow-500'}`}>
                        {getTypeIcon(renewal.type)}
                      </div>
                      <div>
                        <div className="font-medium text-white text-sm">{renewal.name}</div>
                        <div className="text-xs text-neutral-400 capitalize">{renewal.type}</div>
                        <div className="flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3 text-neutral-500" />
                          <span className="text-xs text-neutral-400">{renewal.renewDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-white">
                        ₹{renewal.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div className={`text-xs font-medium ${isUrgent ? 'text-red-500' : 'text-yellow-500'}`}>
                        {daysLeft} day{daysLeft !== 1 ? 's' : ''} left
                      </div>
                      {renewal.autoRenew && (
                        <div className="text-xs text-green-500 mt-1">Auto-renew ON</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <div className="text-sm text-neutral-400">No upcoming renewals</div>
          <div className="text-xs text-neutral-500 mt-1">All services are up to date!</div>
        </div>
      )}
    </div>
  );
};
