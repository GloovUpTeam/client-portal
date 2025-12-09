import { InvoiceDetail } from '../types/invoices';
import { generateInvoiceHtml } from './htmlExport';
import { generateGloovUpProformaHtml } from './gloovupTemplate';

export interface PdfExportOptions {
  template?: 'default' | 'gloovup';
}

export async function generateInvoicePdf(invoice: InvoiceDetail, options: PdfExportOptions = {}): Promise<Blob> {
  // Mock PDF generation: In a real app, this would use jspdf or html2pdf
  // For this requirement, we return the HTML content as a Blob with application/pdf type
  // or a valid PDF if we had a library. The user accepted a "mock approach".
  
  // We simulate a delay for the "Preparing download..." UX
  await new Promise(resolve => setTimeout(resolve, 1500));

  let htmlContent: string;
  
  if (options.template === 'gloovup') {
    htmlContent = generateGloovUpProformaHtml(invoice);
  } else {
    htmlContent = generateInvoiceHtml(invoice, 'pdf-mock');
  }
  
  // Returning HTML as PDF is a common "mock" when no PDF library is allowed/available
  // The browser will download it as .pdf, but it will be HTML content.
  // To make it slightly more "pdf-like" for the mock, we could just return the HTML blob
  // but the requirement asks for a PDF file.
  
  return new Blob([htmlContent], { type: 'application/pdf' });
}
