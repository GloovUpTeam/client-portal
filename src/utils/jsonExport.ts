import { InvoiceDetail } from '../types/invoices';

export const generateInvoiceJson = (invoice: InvoiceDetail): string => {
  const exportData = {
    invoiceNumber: invoice.number,
    issuedDate: invoice.issuedDate,
    dueDate: invoice.dueDate,
    client: invoice.client,
    items: invoice.items.map(item => ({
      description: item.description,
      quantity: item.quantity,
      rate: item.rate,
      total: item.amount
    })),
    subtotal: invoice.subtotal,
    tax: invoice.tax,
    total: invoice.total,
    isGloovup: true,
    template: 'proforma',
    metadata: {
      generatedAt: new Date().toISOString(),
      generatedBy: 'GloovUp Client Portal'
    }
  };
  return JSON.stringify(exportData, null, 2);
};
