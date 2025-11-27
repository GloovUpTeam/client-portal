import React from 'react';
import { INVOICES } from '../services/mockData';
import { Button } from '../components/atoms/Button';
import { Download, Filter, FileText, CheckCircle, AlertCircle, Clock } from 'lucide-react';

export const Invoices: React.FC = () => {
  const getStatusBadge = (status: string) => {
    switch(status) {
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
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-3xl font-display font-bold text-white">Invoices</h1>
           <p className="text-neutral-400 mt-1">View and download your billing history.</p>
        </div>
        <Button variant="secondary">
          <Download className="w-4 h-4 mr-2" /> Export CSV
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-brand-surface p-6 rounded-xl border border-neutral-800">
          <p className="text-neutral-400 text-sm font-medium">Outstanding Balance</p>
          <p className="text-3xl font-bold text-white mt-2">$7,500.00</p>
        </div>
        <div className="bg-brand-surface p-6 rounded-xl border border-neutral-800">
          <p className="text-neutral-400 text-sm font-medium">Paid this Month</p>
          <p className="text-3xl font-bold text-brand mt-2">$5,000.00</p>
        </div>
        <div className="bg-brand-surface p-6 rounded-xl border border-neutral-800">
          <p className="text-neutral-400 text-sm font-medium">Overdue</p>
          <p className="text-3xl font-bold text-red-500 mt-2">$2,500.00</p>
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-brand-surface border border-neutral-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-900/50">
                <th className="p-4 font-medium text-neutral-400 text-sm">Invoice ID</th>
                <th className="p-4 font-medium text-neutral-400 text-sm">Date Issued</th>
                <th className="p-4 font-medium text-neutral-400 text-sm">Due Date</th>
                <th className="p-4 font-medium text-neutral-400 text-sm">Amount</th>
                <th className="p-4 font-medium text-neutral-400 text-sm">Status</th>
                <th className="p-4 font-medium text-neutral-400 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {INVOICES.map((inv) => (
                <tr key={inv.id} className="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-neutral-800 rounded text-neutral-400">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="font-mono text-sm text-white font-medium">{inv.id}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-neutral-400">{inv.date}</td>
                  <td className="p-4 text-sm text-neutral-400">{inv.dueDate}</td>
                  <td className="p-4 text-sm text-white font-bold">${inv.amount.toLocaleString()}</td>
                  <td className="p-4">{getStatusBadge(inv.status)}</td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-brand">
                      <Download className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Invoices;