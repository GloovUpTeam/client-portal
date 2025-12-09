// src/services/ticketsService.ts
import { supabase } from '../config/supabaseClient'
import type { PostgrestError } from '@supabase/supabase-js'

export type Ticket = {
  id: string
  title: string
  description?: string
  priority?: string
  status?: string
  client_id?: string
  assigned_to?: string
  created_at?: string
}

export async function fetchTicketsForClient(clientId: string): Promise<{ data?: Ticket[]; error?: PostgrestError }> {
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })
  return { data: data ?? undefined, error: error ?? undefined }
}

export async function createTicket(
  payload: {
    title: string
    description?: string
    priority?: string
    client_id: string
    assigned_to?: string
    attachments?: File[] // optional file list
  }
) {
  // 1) insert ticket
  const { data: ticket, error: insertErr } = await supabase
    .from('tickets')
    .insert({
      title: payload.title,
      description: payload.description,
      priority: payload.priority || 'normal',
      client_id: payload.client_id,
      assigned_to: payload.assigned_to || null
    })
    .select()
    .single()

  if (insertErr) throw insertErr
  // 2) handle attachments if any
  if (payload.attachments && payload.attachments.length > 0) {
    const uploaded = []
    for (const file of payload.attachments) {
      const path = `tickets/${ticket.id}/${Date.now()}_${file.name}`
      const { data: uploadData, error: uploadErr } = await supabase.storage.from('attachments').upload(path, file, { cacheControl: '3600', upsert: false })
      if (uploadErr) {
        // optionally continue or rollback: here throw error
        throw uploadErr
      }
      const { data: { publicUrl } } = supabase.storage.from('attachments').getPublicUrl(path)
      // save attachment record
      const { error: attachErr } = await supabase.from('attachments').insert({
        ticket_id: ticket.id,
        storage_path: path,
        public_url: publicUrl,
        filename: file.name
      })
      if (attachErr) throw attachErr
      uploaded.push(publicUrl)
    }
    return { ticket, attachments: uploaded }
  }
  return { ticket }
}

export async function fetchTicketById(ticketId: string) {
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .eq('id', ticketId)
    .single()
  return { data: data ?? undefined, error }
}
