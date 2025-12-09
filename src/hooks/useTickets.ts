import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../config/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { formatSupabaseError } from '../utils/supabaseError';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assign_to?: string;
  project_id?: string;
  attachments: string[]; // Array of storage paths or URLs
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTicketData {
  title: string;
  description: string;
  priority: string;
  assign_to?: string;
  project_id?: string;
  files?: File[];
}

export const useTickets = () => {
  const { user, profile } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    
    console.log("[useTickets] Fetching tickets for user:", user.id);
    
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("[useTickets] Error:", error);
        throw error;
      }
      
      console.log("[useTickets] Loaded", data?.length || 0, "tickets");
      setTickets(data as Ticket[]);
    } catch (err: any) {
      console.error("[useTickets] Fetch failed:", err);
      const formatted = formatSupabaseError(err);
      setError(formatted.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createTicket = async (data: CreateTicketData) => {
    if (!user || !profile) throw new Error('Must be logged in to create a ticket');
    setLoading(true);
    setError(null);

    try {
      // 1. Upload files if any
      const attachmentPaths: string[] = [];
      if (data.files && data.files.length > 0) {
        for (const file of data.files) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
          
          const { error: uploadError, data: uploadData } = await supabase.storage
            .from('ticket-attachments')
            .upload(fileName, file);

          if (uploadError) throw uploadError;
          
          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('ticket-attachments')
            .getPublicUrl(fileName);
            
          attachmentPaths.push(publicUrl);
        }
      }

      // 2. Insert Ticket
      const ticketPayload = {
        title: data.title,
        description: data.description,
        priority: data.priority,
        client_id: user.id, // Link to auth user ID
        submitted_by: user.id, // Ensure submitted_by is set to authenticated user id
        assign_to: data.assign_to,
        project_id: data.project_id,
        attachments: attachmentPaths, // Stored as JSONB array
        created_by: user.id, // Link to auth user ID
        status: 'open'
      };

      const { data: newTicket, error: insertError } = await supabase
        .from('tickets')
        .insert([ticketPayload])
        .select()
        .single();

      if (insertError) throw insertError;

      // 3. Update local state
      setTickets(prev => [newTicket as Ticket, ...prev]);
      return newTicket;

    } catch (err: any) {
      const formatted = formatSupabaseError(err);
      setError(formatted.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    tickets,
    loading,
    error,
    fetchTickets,
    createTicket
  };
};
