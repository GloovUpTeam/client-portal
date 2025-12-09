import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/atoms/Button';
import { Download } from 'lucide-react';
import { fetchInvoicesForClient } from '../services/invoiceService';
import { exportInvoicesToCSV } from '../utils/csvExport';
import { InvoiceTable } from '../components/invoices/InvoiceTable';
import { formatINR } from '../utils/formatCurrency';
import { InvoiceDetail } from '../types/invoices';
import { useAuth } from '../contexts/AuthContext';

export const Invoices: React.FC = () => {
  const navigate = useNavigate();
  const { profile, loading: authLoading } = useAuth();
  const [invoices, setInvoices] = useState<InvoiceDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadInvoices = async () => {
      if (!profile || !profile.id) {
        if (mounted) setLoading(false);
        return;
      }
      const clientId = profile.id;
      console.log('[Invoices] Using clientId:', clientId);
      try {
        const { data, error } = await fetchInvoicesForClient(clientId);
        if (!mounted) return;
        console.log('[Invoices] Supabase response for clientId', clientId, ':', data, error);
        if (error) {
          toast.error(error.message || 'Failed to fetch invoices');
        }
        if (Array.isArray(data)) {
          const mappedInvoices: InvoiceDetail[] = data.map(i => ({
            id: i.id,
            number: i.invoice_number,
            client: { name: profile.full_name || 'Client' },
            items: [],
            subtotal: i.total || 0,
            tax: 0,
            taxRate: 0,
            total: i.total || 0,
            status: (i.status as any) || 'Pending',
            issuedDate: i.issued_date || new Date().toISOString(),
            dueDate: i.due_date || new Date().toISOString(),
          }));
          console.log('[Invoices] Mapped invoices for table:', mappedInvoices);
          setInvoices(mappedInvoices);
        } else {
          setInvoices([]);
        }
      } catch (err: any) {
        console.error('Failed to load invoices', err);
        toast.error(err?.message || 'Failed to load invoices');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    if (!authLoading && profile && profile.id) {
      loadInvoices();
    }
    return () => { mounted = false; };
  }, [profile, authLoading]);

  const summary = {
    totalAmountPaid: invoices.filter(i => i.status === 'Paid').reduce((acc, curr) => acc + curr.total, 0),
    overdue: invoices.filter(i => i.status === 'Overdue').reduce((acc, curr) => acc + curr.total, 0)
  };

  const handleExportCSV = () => {
    exportInvoicesToCSV(invoices, `invoices-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleInvoiceClick = (invoiceId: string) => {
    navigate(`/invoices/${invoiceId}`);
  };

  if (loading || authLoading) return <div className="text-white p-6">Loading invoices...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-3xl font-display font-bold text-white">Invoices</h1>
           <p className="text-neutral-400 mt-1">View and download your billing history.</p>
        </div>
        <Button variant="secondary" onClick={handleExportCSV}>
          <Download className="w-4 h-4 mr-2" /> Export CSV
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-brand-surface p-6 rounded-xl border border-neutral-800">
          <p className="text-neutral-400 text-sm font-medium">Total Amount Paid</p>
          <p className="text-3xl font-bold text-white mt-2">{formatINR(summary.totalAmountPaid)}</p>
        </div>
        <div className="bg-brand-surface p-6 rounded-xl border border-neutral-800">
          <p className="text-neutral-400 text-sm font-medium">Overdue</p>
          <p className="text-3xl font-bold text-red-500 mt-2">{formatINR(summary.overdue)}</p>
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-brand-surface border border-neutral-800 rounded-xl overflow-hidden">
        <InvoiceTable invoices={invoices} onInvoiceClick={handleInvoiceClick} />
      </div>
    </div>
  );
};

export default Invoices;
