import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/atoms/Button';
import { Download } from 'lucide-react';
import { fetchInvoicesForClient } from '../services/invoiceService';
import { exportInvoicesToCSV } from '../utils/csvExport';
import { InvoiceTable } from '../components/invoices/InvoiceTable';
import { formatINR } from '../utils/formatCurrency';
import { InvoiceDetail } from '../types/invoices';
import { supabase } from '../config/supabaseClient';

export const Invoices: React.FC = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<InvoiceDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInvoices = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setLoading(false);
        return;
      }

      const { data, error } = await fetchInvoicesForClient(session.user.id);
      if (data) {
        const mappedInvoices: InvoiceDetail[] = data.map(i => ({
            id: i.id,
            number: i.invoice_number,
            clientId: i.client_id || session.user.id,
            clientName: 'Client', // Mock
            amount: i.total || 0,
            status: (i.status as any) || 'Pending',
            date: i.issued_date || new Date().toISOString(),
            dueDate: i.due_date || new Date().toISOString(),
            items: (i as any).invoice_items?.map((item: any) => ({
                id: item.id,
                description: item.description,
                quantity: item.qty,
                rate: item.unit_price,
                amount: item.qty * item.unit_price
            })) || [],
            total: i.total || 0,
            client: { name: 'Client' }, // Add missing required field
            subtotal: i.total || 0, // Add missing required field
            tax: 0, // Add missing required field
            taxRate: 0 // Add missing required field
        }));
        setInvoices(mappedInvoices);
      }
      setLoading(false);
    };
    loadInvoices();
  }, []);

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

  if (loading) return <div className="text-white p-6">Loading invoices...</div>;

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
