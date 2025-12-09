import React from 'react';
import { InvoiceDue } from '../../mocks/dashboardMocks';
import { DollarSign, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DateRange } from './DateRangeFilter';

interface Props {
  payment: InvoiceDue;
  dateRange?: DateRange;
}

export const DashboardPaymentDueCard: React.FC<Props> = ({ payment, dateRange }) => {
  const hasOverdue = payment.totalOverdue > 0;
  const formattedDate = payment.nearestDueDate
    ? new Date(payment.nearestDueDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : null;

  return (
    <div className="bg-brand-surface p-6 rounded-xl border border-neutral-800">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${hasOverdue ? 'bg-red-500/20 text-red-400' : 'bg-neutral-800 text-brand'}`}>
          <DollarSign className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold text-white">Payment Due</h3>
      </div>
      
      <div className="space-y-4">
        {hasOverdue && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-400">Overdue Amount</p>
              <p className="text-xl font-bold text-white">₹{payment.totalOverdue.toLocaleString('en-IN')}</p>
            </div>
          </div>
        )}
        
        {formattedDate && (
          <div className="text-sm text-neutral-400">
            <span>Next due date: </span>
            <span className="text-white font-medium">{formattedDate}</span>
          </div>
        )}
        
        <Link
          to="/invoices"
          className="block w-full text-center py-2.5 bg-brand text-black font-semibold rounded-lg hover:bg-brand-dark transition-colors"
        >
          Pay Now
        </Link>
      </div>
    </div>
  );
};
