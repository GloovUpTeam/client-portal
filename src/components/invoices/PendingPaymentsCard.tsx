import React from 'react';
import { InvoiceDetail } from '../../types/invoices';
import { Clock, DollarSign } from 'lucide-react';
import { DateRange } from '../dashboard/DateRangeFilter';

interface PendingPaymentsCardProps {
  invoices?: InvoiceDetail[];
  dateRange?: DateRange;
}

export const PendingPaymentsCard: React.FC<PendingPaymentsCardProps> = ({ invoices = [], dateRange }) => {
  const pendingInvoices = invoices.filter((inv) => inv.status === 'Pending' || inv.status === 'Overdue');
  const totalPending = pendingInvoices.reduce((sum, inv) => sum + inv.total, 0);
  const overdueCount = pendingInvoices.filter((inv) => inv.status === 'Overdue').length;

  return (
    <div className="bg-brand-surface p-6 rounded-xl border border-neutral-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Pending Payments</h3>
        <DollarSign className="w-6 h-6 text-yellow-500" />
      </div>

      <div className="mb-4">
        <div className="text-3xl font-bold text-white">₹{totalPending.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        <div className="text-sm text-neutral-400 mt-1">
          {pendingInvoices.length} invoice{pendingInvoices.length !== 1 ? 's' : ''} pending
        </div>
      </div>

      {overdueCount > 0 && (
        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <Clock className="w-4 h-4 text-red-500" />
          <span className="text-sm text-red-400 font-medium">
            {overdueCount} overdue invoice{overdueCount !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {pendingInvoices.length > 0 && (
        <div className="mt-4 space-y-2">
          {pendingInvoices.slice(0, 3).map((invoice) => (
            <div key={invoice.id} className="flex justify-between items-center text-sm p-2 hover:bg-neutral-800 rounded transition-colors">
              <div>
                <div className="font-medium text-white">{invoice.number}</div>
                <div className="text-xs text-neutral-500">Due: {invoice.dueDate}</div>
              </div>
              <div className={`font-semibold ${invoice.status === 'Overdue' ? 'text-red-500' : 'text-white'}`}>
                ₹{invoice.total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          ))}
          {pendingInvoices.length > 3 && (
            <div className="text-xs text-neutral-500 text-center pt-2">
              +{pendingInvoices.length - 3} more
            </div>
          )}
        </div>
      )}

      {pendingInvoices.length === 0 && (
        <div className="text-center py-4">
          <div className="text-sm text-neutral-400">No pending payments</div>
          <div className="text-xs text-neutral-500 mt-1">All invoices are up to date!</div>
        </div>
      )}
    </div>
  );
};
