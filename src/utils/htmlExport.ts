import { InvoiceDetail } from '../types/invoices';

// Simple SVG Logo Data URI
const LOGO_DATA_URI = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 50'%3E%3Ctext x='10' y='35' font-family='Arial' font-size='24' font-weight='bold' fill='%2300D2A0'%3EGloov Up%3C/text%3E%3C/svg%3E";

// Mock QR Code Data URI (Generic placeholder)
const QR_DATA_URI = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5QsXFzQz7/4nUAAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAABJUlEQVR42u3SQQ0AAAgDMOZf2BDB2cnWwS1P8wk8h8sWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMGCBQsWLFiwYMF6sQAf7gE0kO2S/gAAAABJRU5ErkJggg==";

export const generateInvoiceHtml = (invoice: InvoiceDetail, template: string = 'default'): string => {
  // Mock signature
  const signature = btoa(JSON.stringify({ id: invoice.id, date: new Date().toISOString(), verified: true }));
  const verificationUrl = `https://app.gloovup.com/invoices/${invoice.number}?sig=${signature}`;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>GloovUp Invoice ${invoice.number}</title>
      <meta name="author" content="GloovUp">
      <meta name="creation-date" content="${new Date().toISOString()}">
      <style>
        @page { size: A4; margin: 0; }
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; line-height: 1.5; margin: 0; padding: 0; background: #fff; -webkit-print-color-adjust: exact; }
        .page { width: 210mm; min-height: 297mm; padding: 20mm; margin: 0 auto; background: white; box-sizing: border-box; position: relative; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 2px solid #00D2A0; padding-bottom: 20px; }
        .logo { height: 40px; }
        .invoice-title { text-align: right; }
        .invoice-title h1 { margin: 0; font-size: 32px; color: #00D2A0; text-transform: uppercase; letter-spacing: 2px; }
        .invoice-meta { margin-top: 10px; font-size: 14px; color: #666; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
        .section-title { font-size: 12px; font-weight: bold; color: #999; text-transform: uppercase; margin-bottom: 10px; }
        .address { font-size: 14px; line-height: 1.6; }
        .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .table th { text-align: left; padding: 12px; background: #00D2A0; color: white; font-weight: 600; font-size: 14px; text-transform: uppercase; }
        .table td { padding: 12px; border-bottom: 1px solid #eee; font-size: 14px; }
        .text-right { text-align: right; }
        .totals { margin-left: auto; width: 300px; }
        .total-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; }
        .total-row.final { font-size: 18px; font-weight: bold; color: #00D2A0; border-top: 2px solid #eee; margin-top: 8px; padding-top: 16px; }
        .footer { position: absolute; bottom: 20mm; left: 20mm; right: 20mm; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999; text-align: center; }
        .qr-section { margin-top: 40px; display: flex; align-items: center; gap: 20px; font-size: 12px; color: #666; }
        .qr-code { width: 80px; height: 80px; }
        .terms { margin-top: 40px; font-size: 12px; color: #666; }
        @media print {
          body { padding: 0; background: white; }
          .page { margin: 0; box-shadow: none; }
        }
      </style>
    </head>
    <body>
      <div class="page">
        <div class="header">
          <div>
            <img src="${LOGO_DATA_URI}" alt="Gloov Up" class="logo">
            <div style="margin-top: 10px; font-size: 14px; color: #666;">Digital Solutions</div>
          </div>
          <div class="invoice-title">
            <h1>Invoice</h1>
            <div class="invoice-meta">
              <div><strong>#:</strong> ${invoice.number}</div>
              <div><strong>Date:</strong> ${invoice.issuedDate}</div>
              <div><strong>Due:</strong> ${invoice.dueDate}</div>
            </div>
          </div>
        </div>

        <div class="grid">
          <div>
            <div class="section-title">Bill To</div>
            <div class="address">
              <strong>${invoice.client.name}</strong><br>
              ${invoice.client.email || ''}<br>
              ${invoice.client.phone || ''}<br>
              ${invoice.client.address || ''}
            </div>
          </div>
          <div class="text-right">
            <div class="section-title">Pay To</div>
            <div class="address">
              <strong>Gloov Up Digital Solutions</strong><br>
              accounts@gloovup.com<br>
              +1 (555) 123-4567<br>
              123 Tech Park, Innovation Way
            </div>
          </div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Description</th>
              <th class="text-right">Qty</th>
              <th class="text-right">Rate</th>
              <th class="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items.map(item => `
              <tr>
                <td>${item.description}</td>
                <td class="text-right">${item.quantity}</td>
                <td class="text-right">$${item.rate.toFixed(2)}</td>
                <td class="text-right">$${item.amount.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals">
          <div class="total-row">
            <span>Subtotal</span>
            <span>$${invoice.subtotal.toFixed(2)}</span>
          </div>
          <div class="total-row">
            <span>Tax (${invoice.taxRate}%)</span>
            <span>$${invoice.tax.toFixed(2)}</span>
          </div>
          <div class="total-row final">
            <span>Total</span>
            <span>$${invoice.total.toFixed(2)}</span>
          </div>
        </div>

        <div class="qr-section">
          <img src="${QR_DATA_URI}" alt="Verification QR" class="qr-code">
          <div>
            <strong>Scan to Verify</strong><br>
            ${verificationUrl}<br>
            <span style="font-family: monospace; font-size: 10px; color: #999;">Sig: ${signature.substring(0, 20)}...</span>
          </div>
        </div>

        <div class="terms">
          <strong>Terms & Conditions:</strong><br>
          Payment is due within 14 days. Please include invoice number on your check.
        </div>

        <div class="footer">
          Gloov Up Digital Solutions &bull; www.gloovup.com &bull; Thank you for your business!
        </div>
      </div>
    </body>
    </html>
  `;
};
