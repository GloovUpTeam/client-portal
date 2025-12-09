import { InvoiceDetail } from '../types/invoices';

/**
 * Generate CSV content from invoices
 */
export function generateInvoiceCSV(invoices: InvoiceDetail[]): string {
  const headers = [
    'Invoice Number',
    'Client Name',
    'Issued Date',
    'Due Date',
    'Status',
    'Subtotal (INR)',
    'Tax (INR)',
    'Total (INR)',
    'Paid Date',
    'Payment Method',
  ];

  const rows = invoices.map((inv) => [
    inv.number,
    inv.client.name,
    inv.issuedDate,
    inv.dueDate,
    inv.status,
    inv.subtotal.toFixed(2),
    inv.tax.toFixed(2),
    inv.total.toFixed(2),
    inv.paidDate || '',
    inv.paymentMethod || '',
  ]);

  const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');

  return csvContent;
}

/**
 * Download CSV file
 */
export function downloadCSV(content: string, filename: string = 'invoices.csv'): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export invoices to CSV
 */
export function exportInvoicesToCSV(invoices: InvoiceDetail[], filename?: string): void {
  const csvContent = generateInvoiceCSV(invoices);
  downloadCSV(csvContent, filename);
}
