import React, { useState, useRef } from 'react';
import { InvoiceDetail } from '../../types/invoices';
import { Download, Loader2 } from 'lucide-react';
import { getInvoicePdfUrl } from '../../services/invoiceService';
import { saveBlobAsFile } from '../../utils/download';

interface InvoiceRowActionsProps {
  invoice: InvoiceDetail;
  variant?: 'row' | 'detail';
}

export const InvoiceRowActions: React.FC<InvoiceRowActionsProps> = ({ invoice, variant = 'row' }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const isDownloadingRef = useRef(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  }

  async function handleDownload(invoiceId: string) {
    if (isDownloadingRef.current) return;
    isDownloadingRef.current = true;
    setIsGenerating(true);
    try {
      const { url } = await getInvoicePdfUrl(invoiceId);
      if (url) {
          const link = document.createElement('a');
          link.href = url;
          link.download = `${invoice.number || invoiceId}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          showToast('success', `Downloaded ${invoice.number || invoiceId}.pdf`);
      } else {
          window.open(`/invoices/${invoiceId}`, '_blank');
          showToast('success', 'Opened invoice view');
      }
    } catch (error) {
      console.error('Download failed:', error);
      showToast('error', 'Invoice PDF download failed. Try again later.');
    } finally {
      isDownloadingRef.current = false;
      setIsGenerating(false);
    }
  }

  return (
    <div className="flex items-center">
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDownload(invoice.id);
        }}
        disabled={isGenerating}
        title="Download PDF"
        className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
      >
        {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
      </button>

      {toast && (
        <div className={`ml-3 px-3 py-1 rounded-md text-sm ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};
