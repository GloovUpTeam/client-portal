import React from 'react';
import { UserProfile } from '../../types/user';
import { Ticket, CreditCard, AlertCircle, Clock } from 'lucide-react';

interface ProfileSummaryProps {
  stats: UserProfile['stats'];
}

export const ProfileSummary: React.FC<ProfileSummaryProps> = ({ stats }) => {
  if (!stats) return null;

  const items = [
    { 
      label: 'Tickets Raised', 
      value: stats.ticketsRaised, 
      icon: Ticket,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10'
    },
    { 
      label: 'Payments Made', 
      value: `₹${(stats.paymentsMade || 0).toLocaleString()}`, 
      icon: CreditCard,
      color: 'text-green-400',
      bg: 'bg-green-400/10'
    },
    { 
      label: 'Pending Amount', 
      value: `₹${(stats.pendingAmount || 0).toLocaleString()}`, 
      icon: AlertCircle,
      color: 'text-red-400',
      bg: 'bg-red-400/10'
    },
    { 
      label: 'Last Updated', 
      value: stats.lastUpdated, 
      icon: Clock,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10'
    },
  ];

  return (
    <div className="bg-[#111] border border-white/5 rounded-2xl p-6 shadow-lg mb-8">
      <h3 className="text-lg font-bold text-white mb-6">Account Summary</h3>
      <div className="grid grid-cols-2 gap-4">
        {items.map((item, idx) => (
          <div key={idx} className="bg-[#181818] p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
            <div className={`w-8 h-8 rounded-lg ${item.bg} ${item.color} flex items-center justify-center mb-3`}>
              <item.icon className="w-4 h-4" />
            </div>
            <p className="text-2xl font-bold text-white mb-1">{item.value}</p>
            <p className="text-xs text-neutral-400 font-medium uppercase tracking-wide">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
