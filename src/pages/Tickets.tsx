import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTicketsForClient, createTicket, Ticket } from '../services/ticketsService';
import { TicketCard } from '../components/tickets/TicketCard';
import { TicketForm } from '../components/tickets/TicketForm';
import { Button } from '../components/atoms/Button';
import { Filter, Plus } from 'lucide-react';
import { TicketDetail } from '../types/tickets';
import { supabase } from '../config/supabaseClient';

export const Tickets: React.FC = () => {
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [tickets, setTickets] = useState<TicketDetail[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            setUserId(session.user.id);
            loadTickets(session.user.id);
        } else {
            setLoading(false);
        }
    };
    getUser();
  }, []);

  const loadTickets = async (uid: string) => {
    setLoading(true);
    try {
      const { data, error } = await fetchTicketsForClient(uid);
      if (error) throw error;
      
      // Map DB tickets to TicketDetail (mocking missing relations for now)
      const mappedTickets: TicketDetail[] = (data || []).map(t => ({
        id: t.id,
        title: t.title,
        description: t.description || '',
        priority: (t.priority as any) || 'Medium',
        status: (t.status as any) || 'Open',
        creatorId: t.client_id || uid,
        creator: { id: t.client_id || uid, name: 'User', email: '', avatar: '', role: 'Client' },
        assigneeId: t.assigned_to,
        attachments: [],
        comments: [],
        activities: [],
        createdAt: t.created_at || new Date().toISOString(),
        updatedAt: t.created_at || new Date().toISOString(),
        progress: 0
      }));

      setTickets(mappedTickets);
    } catch (error) {
      console.error("Failed to load tickets", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (data: any) => {
    if (!userId) {
        alert("You must be logged in to create a ticket.");
        return;
    }
    try {
      const { ticket, error } = await createTicket({
          ...data,
          client_id: userId,
          attachments: data.attachments // Ensure this is File[]
      });

      if (error) throw error;

      if (ticket) {
        await loadTickets(userId);
        setShowCreateForm(false);
        navigate(`/tickets/${ticket.id}`);
      }
    } catch (error) {
      console.error("Failed to create ticket", error);
      alert("An error occurred.");
    }
  };

  const filteredTickets = filterStatus === 'all'
    ? tickets
    : tickets.filter(t => t.status === filterStatus);

  const getPriorityColor = (p: string) => {
    switch(p) {
      case 'Critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'High': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'Medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      default: return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    }
  };

  if (loading && tickets.length === 0) {
    return <div className="text-white p-6">Loading tickets...</div>;
  }

  return (
    <div className="space-y-6">
      {showCreateForm && (
        <TicketForm
          onSubmit={handleCreateTicket}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Tickets</h1>
          <p className="text-neutral-400 mt-1">Track issues and feature requests.</p>
        </div>
        <div className="flex gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-brand transition-colors"
          >
            <option value="all">All Tickets</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="w-4 h-4 mr-2" /> Create Ticket
          </Button>
        </div>
      </div>

      {/* Tickets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </div>

      {filteredTickets.length === 0 && (
        <div className="text-center py-12 bg-brand-surface border border-neutral-800 rounded-xl">
          <p className="text-neutral-400">No tickets found</p>
        </div>
      )}
    </div>
  );
};
