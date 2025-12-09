import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Calendar, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '../components/atoms/Button';
import { fetchInvoiceById } from '../services/invoiceService';
import { InvoiceRowActions } from '../components/invoices/InvoiceRowActions';

export const InvoiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
        fetchInvoiceById(id).then(({ data }) => {
            if (data) {
                setInvoice({
                    id: data.id,
                    number: data.invoice_number,
                    status: data.status,
                    issuedDate: data.issued_date,
                    dueDate: data.due_date,
                    client: { name: 'Client', email: '', phone: '', address: '' },
                    items: (data as any).invoice_items?.map((item: any) => ({
                        id: item.id,
                        description: item.description,
                        quantity: item.qty,
                        rate: item.unit_price,
                        amount: item.qty * item.unit_price
                    })) || [],
                    subtotal: data.total,
                    tax: 0,
                    total: data.total
                });
            }
            setLoading(false);
        });
    }
  }, [id]);

  if (loading) return <div className="text-white p-6">Loading invoice...</div>;

  if (!invoice) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-white">Invoice not found</h2>
          <p className="text-neutral-400 mt-2">The invoice you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/invoices')} className="mt-6">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Invoices
          </Button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      Paid: 'bg-green-500/10 text-green-500 border-green-500/20',
      Pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      Overdue: 'bg-red-500/10 text-red-500 border-red-500/20',
    }[status] || 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    
    return (
      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold border ${styles}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <Button variant="ghost" onClick={() => navigate('/invoices')} className="mb-4 -ml-2">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Invoices
          </Button>
          <h1 className="text-3xl font-display font-bold text-white">Invoice {invoice.number}</h1>
          <p className="text-neutral-400 mt-1">Issued on {invoice.issuedDate}</p>
        </div>
        <div className="flex gap-3">
          {getStatusBadge(invoice.status)}
          <InvoiceRowActions invoice={invoice} variant="detail" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client & Invoice Info */}
          <div className="bg-brand-surface border border-neutral-800 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Bill To */}
              <div>
                <h3 className="text-sm font-semibold text-neutral-400 uppercase mb-3">Bill To</h3>
                <div className="space-y-2">
                  <div className="text-white font-semibold text-lg">{invoice.client.name}</div>
                  <div className="flex items-center gap-2 text-neutral-400 text-sm">
                    <Mail className="w-4 h-4" />
                    {invoice.client.email}
                  </div>
                  {invoice.client.phone && (
                    <div className="flex items-center gap-2 text-neutral-400 text-sm">
                      <Phone className="w-4 h-4" />
                      {invoice.client.phone}
                    </div>
                  )}
                  {invoice.client.address && (
                    <div className="flex items-start gap-2 text-neutral-400 text-sm">
                      <MapPin className="w-4 h-4 mt-0.5" />
                      <span className="whitespace-pre-line">{invoice.client.address}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Invoice Details */}
              <div>
                <h3 className="text-sm font-semibold text-neutral-400 uppercase mb-3">Invoice Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Invoice Number:</span>
                    <span className="text-white font-mono font-medium">{invoice.number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Issued Date:</span>
                    <span className="text-white">{invoice.issuedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Due Date:</span>
                    <span className="text-white">{invoice.dueDate}</span>
                  </div>
                  {invoice.paidDate && (
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Paid Date:</span>
                      <span className="text-green-500">{invoice.paidDate}</span>
                    </div>
                  )}
                  {invoice.paymentMethod && (
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Payment Method:</span>
                      <span className="text-white">{invoice.paymentMethod}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="bg-brand-surface border border-neutral-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-800 bg-neutral-900/50">
                    <th className="p-4 font-medium text-neutral-400 text-sm">Description</th>
                    <th className="p-4 font-medium text-neutral-400 text-sm text-center w-24">Qty</th>
                    <th className="p-4 font-medium text-neutral-400 text-sm text-right w-32">Rate</th>
                    <th className="p-4 font-medium text-neutral-400 text-sm text-right w-32">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item) => (
                    <tr key={item.id} className="border-b border-neutral-800">
                      <td className="p-4 text-white">{item.description}</td>
                      <td className="p-4 text-neutral-400 text-center">{item.quantity}</td>
                      <td className="p-4 text-neutral-400 text-right">₹{item.rate.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className="p-4 text-white font-semibold text-right">₹{item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="bg-brand-surface border border-neutral-800 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-neutral-400 uppercase mb-3">Notes</h3>
              <p className="text-white text-sm whitespace-pre-line">{invoice.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Total Summary */}
          <div className="bg-brand-surface border border-neutral-800 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-neutral-400 uppercase mb-4">Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-400">Subtotal</span>
                <span className="text-white">₹{invoice.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              {invoice.tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400">Tax ({invoice.taxRate}%)</span>
                  <span className="text-white">₹{invoice.tax.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              )}
              <div className="border-t border-neutral-800 pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="text-white font-semibold text-lg">Total</span>
                  <span className="text-brand font-bold text-2xl">₹{invoice.total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Action */}
          {invoice.status !== 'Paid' && (
            <div className="bg-brand-surface border border-neutral-800 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-neutral-400 uppercase mb-4">Payment</h3>
              <p className="text-neutral-400 text-sm mb-4">
                {invoice.status === 'Overdue' 
                  ? 'This invoice is overdue. Please make payment as soon as possible.'
                  : 'Payment is due by ' + invoice.dueDate}
              </p>
              <Button className="w-full">
                <CreditCard className="w-4 h-4 mr-2" /> Pay Now
              </Button>
            </div>
          )}

          {/* Timeline */}
          <div className="bg-brand-surface border border-neutral-800 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-neutral-400 uppercase mb-4">Timeline</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-brand mt-0.5" />
                <div>
                  <div className="text-white text-sm font-medium">Invoice Issued</div>
                  <div className="text-neutral-400 text-xs">{invoice.issuedDate}</div>
                </div>
              </div>
              {invoice.paidDate && (
                <div className="flex items-start gap-3">
                  <CreditCard className="w-4 h-4 text-green-500 mt-0.5" />
                  <div>
                    <div className="text-white text-sm font-medium">Payment Received</div>
                    <div className="text-neutral-400 text-xs">{invoice.paidDate}</div>
                    {invoice.paymentMethod && (
                      <div className="text-neutral-500 text-xs">via {invoice.paymentMethod}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;
