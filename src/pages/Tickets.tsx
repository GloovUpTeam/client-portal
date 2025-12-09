import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTickets, Ticket } from '../services/ticketsService';
import { TicketCard } from '../components/tickets/TicketCard';
import { Button } from '../components/atoms/Button';
import { Filter, Plus } from 'lucide-react';
import { TicketDetail } from '../types/tickets';

export const Tickets: React.FC = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const isFetching = React.useRef(false);

  useEffect(() => {
    let mounted = true;
    
    // Prevent double-fetching in StrictMode
    if (isFetching.current) return;
    isFetching.current = true;

    fetchTickets()
      .then(data => {
        if (!mounted) return;
        setTickets(data || []);
      })
      .catch(e => {
        console.error('tickets load failed', e);
        if (!mounted) return;
        setError('Failed to load tickets. Check console.');
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
        isFetching.current = false;
      });
    return () => { mounted = false; };
  }, []);

  // Map hook tickets to TicketDetail for UI compatibility
  const mappedTickets: TicketDetail[] = tickets.map(t => ({
    id: t.id,
    title: t.title,
    description: t.description || '',
    priority: (t.priority as any) || 'normal',
    status: (t.status as any) || 'open',
    creatorId: t.created_by,
    creator: { id: t.created_by, name: 'User', email: '', avatar: '', role: 'Client' },
    assigneeId: t.assign_to,
    attachments: (t.attachments || []).map(url => ({ 
        id: url, 
        name: 'Attachment', 
        url, 
        type: 'file', 
        size: 0,
        mime: 'application/octet-stream',
        uploadedAt: new Date().toISOString()
    })),
    comments: [],
    activities: [],
    createdAt: t.created_at || new Date().toISOString(),
    updatedAt: t.updated_at || new Date().toISOString(),
    progress: 0
  }));

  const filteredTickets = filterStatus === 'all' 
    ? mappedTickets 
    : mappedTickets.filter(t => t.status.toLowerCase() === filterStatus.toLowerCase());

  if (loading) return <div className="text-white p-6">Loading tickets...</div>;
  if (error) return <div className="text-red-400 p-6">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Tickets</h1>
          <p className="text-neutral-400 mt-1">Manage and track your support requests.</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => navigate('/tickets/new')}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Ticket
        </Button>
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
