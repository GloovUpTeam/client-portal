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
  attachments: string[]
  created_by: string
  updated_at: string
  assign_to?: string
}

export const fetchTickets = async () => {
  console.log("[tickets] Fetching…");
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error("[tickets] No user found");
    return [];
  }

  const { data, error } = await supabase
    .from("tickets")
    .select("*")
    .eq("client_id", user.id)   // 🔥 exactly what RLS expects
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[tickets] ERROR loading tickets", error);
    return [];
  }

  console.log("[tickets] Loaded tickets:", data);
  return data || [];
};

export async function fetchTicketsForClient(clientId: string): Promise<{ data?: Ticket[]; error?: PostgrestError }> {
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })
  return { data: (data as Ticket[]) ?? undefined, error: error ?? undefined }
}

export async function createTicket(
  payload: any
) {
  try {
    // 1) Get auth user
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('Not authenticated');

    // 2) Build payload dynamically with only known, non-empty columns
    const columns = [
      'title', 'description', 'priority', 'project_id', 'assign_to', 'attachments', 'status', 'due_date'
    ];
    const ticketPayload: Record<string, any> = {};
    for (const key of columns) {
      if (payload[key] !== undefined && payload[key] !== null && payload[key] !== '') {
        ticketPayload[key] = payload[key];
      }
    }
    ticketPayload['submitted_by'] = user.id;

    const { data: ticket, error: insertErr, status, request } = await supabase
      .from('tickets')
      .insert(ticketPayload)
      .select()
      .single();

    if (insertErr) {
      console.error('[createTicket] error:', {
        message: insertErr.message,
        details: insertErr.details,
        request: ticketPayload
      });
      throw insertErr;
    }

    if (insertErr) throw insertErr
    
    // 3) handle attachments if any
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
  } catch (err) {
    console.error('createTicket failed', err);
    throw err;
  }
}

export async function fetchTicketById(ticketId: string) {
  const { data, error } = await supabase
    .from('tickets')
    .select(`
      *,
      created_by:profiles!tickets_created_by_fkey (
        id, full_name, email, role, avatar_url
      )
    `)
    .eq('id', ticketId)
    .single()
  
  // Fetch comments separately since we might not have the relation set up perfectly in types yet
  const { data: comments, error: commentsError } = await supabase
    .from('ticket_comments')
    .select(`
      *,
      author:profiles (
        id, full_name, email, role, avatar_url
      )
    `)
    .eq('ticket_id', ticketId)
    .order('created_at', { ascending: true });

  if (data) {
    return { 
      data: { 
        ...data, 
        comments: comments || [] 
      }, 
      error 
    }
  }

  return { data: undefined, error }
}

export async function addComment(payload: { ticketId: string; text: string; attachments?: File[] }) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // 1. Upload attachments if any
  const attachmentData: any[] = [];
  if (payload.attachments && payload.attachments.length > 0) {
    for (const file of payload.attachments) {
      const path = `comments/${payload.ticketId}/${Date.now()}_${file.name}`;
      const { error: uploadErr } = await supabase.storage.from('ticket-attachments').upload(path, file);
      if (uploadErr) throw uploadErr;
      
      const { data: { publicUrl } } = supabase.storage.from('ticket-attachments').getPublicUrl(path);
      attachmentData.push({
        name: file.name,
        url: publicUrl,
        type: file.type,
        size: file.size
      });
    }
  }

  // 2. Insert comment
  const { data, error } = await supabase
    .from('ticket_comments')
    .insert({
      ticket_id: payload.ticketId,
      author_id: user.id, // Assuming profiles.id = auth.users.id
      text: payload.text,
      attachments: attachmentData
    })
    .select(`
      *,
      author:profiles (
        id, full_name, email, role, avatar_url
      )
    `)
    .single();

  if (error) throw error;
  return data;
}

export async function updateTicketStatus(ticketId: string, status: string) {
  const { data, error } = await supabase
    .from('tickets')
    .update({ status })
    .eq('id', ticketId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateTicketPriority(ticketId: string, priority: string) {
  const { data, error } = await supabase
    .from('tickets')
    .update({ priority })
    .eq('id', ticketId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function removeAttachment(ticketId: string, attachmentPath: string) {
    // This is complex because attachments are JSONB. 
    // For now, we'll just return the ticket as is or implement a filter if we can.
    // A proper implementation would fetch the ticket, filter the JSON array, and update it.
    
    const { data: ticket, error: fetchError } = await supabase
        .from('tickets')
        .select('attachments')
        .eq('id', ticketId)
        .single();
        
    if (fetchError) throw fetchError;
    
    const currentAttachments = ticket.attachments || [];
    // Assuming attachmentPath is the URL or some ID in the JSON
    const updatedAttachments = (currentAttachments as any[]).filter((a: any) => 
        (typeof a === 'string' ? a !== attachmentPath : a.url !== attachmentPath)
    );
    
    const { data, error } = await supabase
        .from('tickets')
        .update({ attachments: updatedAttachments })
        .eq('id', ticketId)
        .select()
        .single();

    if (error) throw error;
    return data;
}
