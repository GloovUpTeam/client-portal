import React, { useState } from 'react';
import { InvoiceDetail } from '../../types/invoices';
import { Download, Loader2, Eye, MoreVertical } from 'lucide-react';
import { downloadInvoicePdf } from '../../services/invoiceService';
import toast from 'react-hot-toast';

interface InvoiceRowActionsProps {
  invoice: InvoiceDetail;
  variant?: 'row' | 'detail';
}

export const InvoiceRowActions: React.FC<InvoiceRowActionsProps> = ({ invoice, variant = 'row' }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    try {
      // Assuming invoice.number is the identifier, fallback to id
      const id = invoice.number || invoice.id;
      await downloadInvoicePdf(id);
      toast.success(`Downloaded invoice ${id}`);
    } catch (error) {
      console.error('Download failed', error);
      toast.error('Failed to download invoice');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex items-center justify-end space-x-2">
      <button 
        onClick={handleDownload}
        disabled={isGenerating}
        className="p-1 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
        title="Download PDF"
      >
        {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
      </button>
      <button 
        className="p-1 text-gray-400 hover:text-white transition-colors"
        title="View Details"
      >
        <Eye className="w-4 h-4" />
      </button>
      <button 
        className="p-1 text-gray-400 hover:text-white transition-colors"
      >
        <MoreVertical className="w-4 h-4" />
      </button>
    </div>
  );
};
