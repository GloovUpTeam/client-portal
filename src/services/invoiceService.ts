// src/services/invoiceService.ts
import { supabase } from '../config/supabaseClient'
import type { PostgrestError } from '@supabase/supabase-js'

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
  const { data, error } = await supabase
    .from('invoices')
    .select('*, invoice_items(*)')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })
  return { data: data ?? undefined, error }
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
