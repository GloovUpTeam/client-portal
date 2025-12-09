import { InvoiceDetail } from '../types/invoices';

// GloovUp Brand Colors
const COLORS = {
  primary: '#00D2A0',
  secondary: '#1A1A1A',
  text: '#333333',
  lightGray: '#F5F5F5',
  border: '#E0E0E0'
};

export const generateGloovUpProformaHtml = (invoice: InvoiceDetail): string => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Proforma Invoice ${invoice.number}</title>
      <style>
        @page { size: A4; margin: 0; }
        body {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          color: ${COLORS.text};
          margin: 0;
          padding: 0;
          background: white;
          -webkit-print-color-adjust: exact;
        }
        .page {
          width: 210mm;
          min-height: 297mm;
          padding: 15mm 20mm;
          margin: 0 auto;
          background: white;
          box-sizing: border-box;
          position: relative;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 50px;
        }
        .brand-logo {
          font-size: 28px;
          font-weight: 900;
          color: ${COLORS.secondary};
          letter-spacing: -1px;
        }
        .brand-logo span {
          color: ${COLORS.primary};
        }
        .document-title {
          text-align: right;
        }
        .document-title h1 {
          margin: 0;
          font-size: 24px;
          text-transform: uppercase;
          color: ${COLORS.secondary};
          letter-spacing: 2px;
        }
        .document-meta {
          margin-top: 10px;
          font-size: 13px;
          color: #666;
        }
        .meta-row {
          display: flex;
          justify-content: flex-end;
          gap: 15px;
          margin-bottom: 4px;
        }
        .meta-label {
          font-weight: 600;
          color: #999;
        }
        .grid-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-bottom: 40px;
        }
        .address-box h3 {
          font-size: 11px;
          text-transform: uppercase;
          color: #999;
          margin: 0 0 10px 0;
          letter-spacing: 1px;
        }
        .address-content {
          font-size: 14px;
          line-height: 1.6;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        .items-table th {
          text-align: left;
          padding: 12px 0;
          border-bottom: 2px solid ${COLORS.secondary};
          font-size: 12px;
          text-transform: uppercase;
          color: ${COLORS.secondary};
        }
        .items-table td {
          padding: 15px 0;
          border-bottom: 1px solid ${COLORS.border};
          font-size: 14px;
        }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        
        .totals-section {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 50px;
        }
        .totals-box {
          width: 300px;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 14px;
        }
        .grand-total {
          font-size: 18px;
          font-weight: bold;
          color: ${COLORS.primary};
          border-top: 2px solid ${COLORS.border};
          margin-top: 10px;
          padding-top: 15px;
        }
        .footer {
          position: absolute;
          bottom: 15mm;
          left: 20mm;
          right: 20mm;
          text-align: center;
          font-size: 11px;
          color: #999;
          border-top: 1px solid ${COLORS.border};
          padding-top: 20px;
        }
        .bank-details {
          background: ${COLORS.lightGray};
          padding: 20px;
          border-radius: 8px;
          font-size: 13px;
          margin-top: 40px;
          width: 60%;
        }
        .bank-details h4 {
          margin: 0 0 10px 0;
          color: ${COLORS.secondary};
        }
        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
          background: ${COLORS.lightGray};
          color: #666;
          margin-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="page">
        <div class="header">
          <div class="brand-logo">
            Gloov<span>Up</span>
          </div>
          <div class="document-title">
            <h1>Proforma Invoice</h1>
            <div class="status-badge">${invoice.status}</div>
            <div class="document-meta">
              <div class="meta-row">
                <span class="meta-label">Invoice No:</span>
                <span>${invoice.number}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Date:</span>
                <span>${formatDate(invoice.issuedDate)}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Due Date:</span>
                <span>${formatDate(invoice.dueDate)}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="grid-container">
          <div class="address-box">
            <h3>Bill To</h3>
            <div class="address-content">
              <strong>${invoice.client.name}</strong><br>
              ${invoice.client.email ? `<div>${invoice.client.email}</div>` : ''}
              ${invoice.client.phone ? `<div>${invoice.client.phone}</div>` : ''}
              ${invoice.client.address ? `<div style="white-space: pre-line">${invoice.client.address}</div>` : ''}
            </div>
          </div>
          <div class="address-box text-right">
            <h3>Payable To</h3>
            <div class="address-content">
              <strong>Gloov Up Digital Solutions</strong><br>
              123 Innovation Way<br>
              Tech Park, Suite 400<br>
              San Francisco, CA 94105<br>
              billing@gloovup.com
            </div>
          </div>
        </div>

        <table class="items-table">
          <thead>
            <tr>
              <th style="width: 50%">Description</th>
              <th class="text-center" style="width: 15%">Qty</th>
              <th class="text-right" style="width: 15%">Rate</th>
              <th class="text-right" style="width: 20%">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items.map(item => `
              <tr>
                <td>
                  <strong>${item.description}</strong>
                </td>
                <td class="text-center">${item.quantity}</td>
                <td class="text-right">$${item.rate.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                <td class="text-right">$${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals-section">
          <div class="totals-box">
            <div class="total-row">
              <span style="color: #666">Subtotal</span>
              <span>$${invoice.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div class="total-row">
              <span style="color: #666">Tax (${invoice.taxRate}%)</span>
              <span>$${invoice.tax.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div class="total-row grand-total">
              <span>Total Due</span>
              <span>$${invoice.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        <div class="bank-details">
          <h4>Bank Transfer Details</h4>
          <div style="display: grid; grid-template-columns: 100px 1fr; gap: 5px;">
            <span style="color: #666">Bank Name:</span> <span>Silicon Valley Bank</span>
            <span style="color: #666">Account Name:</span> <span>Gloov Up Inc.</span>
            <span style="color: #666">Account No:</span> <span>1234567890</span>
            <span style="color: #666">Routing No:</span> <span>098765432</span>
          </div>
        </div>

        <div class="footer">
          <p>Thank you for your business!</p>
          <p>Gloov Up Digital Solutions • www.gloovup.com • +1 (555) 123-4567</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
