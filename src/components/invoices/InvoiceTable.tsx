import React from 'react';
import { InvoiceDetail } from '../../types/invoices';
import { FileText, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { InvoiceRowActions } from './InvoiceRowActions';
import { formatINR } from '../../utils/formatCurrency';

interface InvoiceTableProps {
  invoices: InvoiceDetail[];
  onInvoiceClick?: (invoiceId: string) => void;
}

export const InvoiceTable: React.FC<InvoiceTableProps> = ({ invoices, onInvoiceClick }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
            <CheckCircle className="w-3 h-3" /> Paid
          </span>
        );
      case 'Overdue':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20">
            <AlertCircle className="w-3 h-3" /> Overdue
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-neutral-800 bg-neutral-900/50">
            <th className="p-4 font-medium text-neutral-400 text-sm">Invoice #</th>
            <th className="p-4 font-medium text-neutral-400 text-sm">Client</th>
            <th className="p-4 font-medium text-neutral-400 text-sm">Issued Date</th>
            <th className="p-4 font-medium text-neutral-400 text-sm">Due Date</th>
            <th className="p-4 font-medium text-neutral-400 text-sm">Status</th>
            <th className="p-4 font-medium text-neutral-400 text-sm text-right">Amount</th>
            <th className="p-4 font-medium text-neutral-400 text-sm text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {(invoices || []).length ? (
            (invoices || []).map((invoice) => (
              <tr
                key={invoice.id}
                className="border-b border-neutral-800 hover:bg-neutral-800/30 transition-colors cursor-pointer"
                onClick={() => onInvoiceClick?.(invoice.id)}
              >
                <td className="p-4 font-medium text-white">{invoice.number}</td>
                <td className="p-4 text-neutral-400">
                  <div className="text-sm font-medium text-white">{invoice.client?.name}</div>
                  <div className="text-xs text-neutral-500">{invoice.client?.email}</div>
                </td>
                <td className="p-4 text-neutral-400 text-sm">{invoice.issuedDate}</td>
                <td className="p-4 text-neutral-400 text-sm">{invoice.dueDate}</td>
                <td className="p-4">{getStatusBadge(invoice.status)}</td>
                <td className="p-4 text-right font-medium text-white">{formatINR(invoice.total)}</td>
                <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                  <InvoiceRowActions invoice={invoice} />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="p-4 text-neutral-500" colSpan={7}>
                No invoices found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
