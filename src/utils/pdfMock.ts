import { InvoiceDetail } from '../types/invoices';
import { generateInvoiceHtml } from './htmlExport';

/**
 * Generate mock PDF content for invoice
 * In a real app, this would use a PDF library like jsPDF or pdfmake
 * For now, we create a simple HTML representation
 */
export function generateInvoicePdf(invoice: InvoiceDetail): Promise<Blob> {
  return new Promise((resolve) => {
    // Simulate processing time
    setTimeout(() => {
      const htmlContent = generateInvoiceHtml(invoice);
      // In a real implementation, we would convert HTML to PDF Blob here.
      // For this mock, we return the HTML content but will save it with .pdf extension
      // or ideally, we would use a library.
      // Since we are mocking, we return a Blob that contains the HTML but we pretend it's a PDF.
      // Note: Opening this "PDF" might fail in some viewers if they strictly check magic numbers,
      // but browsers often handle it or show text.
      // BETTER MOCK: Return a text file saying "This is a mock PDF".
      // BUT prompt says "Output: high-quality PDF... Mock is acceptable for dev".
      // So we will return the HTML which renders nicely, and the user can "Print to PDF".
      // However, the file extension will be .pdf.
      
      const blob = new Blob([htmlContent], { type: 'text/html' }); 
      resolve(blob);
    }, 1500);
  });
}

/**
 * @deprecated Use generateInvoicePdf instead
 */
export function downloadInvoicePDF(invoice: InvoiceDetail): void {
  generateInvoicePdf(invoice).then(blob => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${invoice.number}.html`; // Fallback to HTML for the deprecated function
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });
}

