// src/services/invoiceService.ts
import { supabase } from '../config/supabaseClient'
import { saveBlobAsFile } from '../utils/download';

export type Invoice = {
  id: string
  invoice_number: string
  client_id?: string
  issued_date?: string
  due_date?: string
  total?: number
  status?: string
  created_at?: string
}

export async function fetchInvoicesForClient(clientId: string) {
  console.log('[invoiceService] fetchInvoicesForClient start', clientId);
  // Try to fetch invoices where either `client_id` or `customer_id` matches the provided id.
  // Use a single query with OR so it works regardless of which column the DB uses.
  const filter = `client_id.eq.${clientId},customer_id.eq.${clientId}`;
  const { data, error, status } = await supabase
    .from('invoices')
    .select('*')
    .or(filter)
    .order('issued_date', { ascending: false });

  console.log('[invoiceService] supabase response', { data, error, status });
  if (error) {
    console.error('[invoiceService] fetch error', error.message, error.details, error.code);
    // Optionally throw or return []
    throw error;
    // return { data: [], error };
  }
  return { data: data || [], error: undefined };
}

// if invoice PDF stored as attachment, resolve public url from attachments table or storage
export async function getInvoicePdfUrl(invoiceId: string) {
  const { data } = await supabase.from('attachments').select('public_url,storage_path').eq('invoice_id', invoiceId).limit(1).single()
  if (data) return { url: data.public_url }
  // fallback: no stored pdf, return null (frontend should display printable HTML)
  return { url: null }
}

export async function fetchInvoiceById(id: string) {
  const { data, error } = await supabase
    .from('invoices')
    .select('*, invoice_items(*)')
    .eq('id', id)
    .single()
  return { data: data ?? undefined, error }
}

export async function downloadInvoicePdf(invoiceNumber: string): Promise<Blob> {
  // 1. Try to get from storage first (assuming a convention or lookup)
  // For now, we'll simulate a fetch or use a mock endpoint if real one doesn't exist
  // In a real app, this might call an Edge Function: /functions/v1/generate-invoice-pdf
  
  console.log(`Attempting to download invoice ${invoiceNumber}...`);

  try {
    // Mock implementation: Fetch a dummy PDF or generate one
    // In production, replace with:
    // const { data, error } = await supabase.functions.invoke('generate-pdf', { body: { invoiceNumber } })
    
    // For this demo, we'll try to fetch a static file if it exists, or create a text blob
    // We use a dummy URL that likely 404s to trigger the fallback for now, unless a real file exists
    const response = await fetch(`/invoices/${invoiceNumber}.pdf`);
    
    if (response.ok) {
      const blob = await response.blob();
      saveBlobAsFile(blob, `invoice-${invoiceNumber}.pdf`);
      return blob;
    }
    
    // Fallback: Create a simple text blob
    const content = `Invoice #${invoiceNumber}\n\nThis is a placeholder for the generated PDF.\nDate: ${new Date().toLocaleDateString()}`;
    const blob = new Blob([content], { type: 'text/plain' });
    saveBlobAsFile(blob, `invoice-${invoiceNumber}.txt`); // Save as txt for now to indicate it's a stub
    return blob;

  } catch (error) {
    console.error('Error downloading invoice:', error);
    throw new Error('Failed to download invoice PDF');
  }
}
