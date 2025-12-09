export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface ClientInfo {
  name: string;
  email?: string;
  address?: string;
  phone?: string;
}

export interface InvoiceDetail {
  id: string;
  number: string;
  issuedDate: string;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  client: ClientInfo;
  items: InvoiceLineItem[];
  subtotal: number;
  tax: number;
  taxRate: number;
  total: number;
  notes?: string;
  paidDate?: string;
  paymentMethod?: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  amount: number;
  date: string;
  method: 'Credit Card' | 'Bank Transfer' | 'PayPal' | 'Check';
  transactionId?: string;
  status: 'Completed' | 'Pending' | 'Failed';
}

export interface Renewal {
  id: string;
  name: string;
  type: 'domain' | 'hosting' | 'service' | 'license';
  renewDate: string;
  amount: number;
  autoRenew: boolean;
  status: 'Active' | 'Expiring' | 'Expired';
}

export interface PaymentInput {
  invoiceId: string;
  amount: number;
  method: Payment['method'];
  date?: string;
}
