import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TicketForm } from '../components/tickets/TicketForm';
import { createTicket } from '../services/ticketsService';
import { CreateTicketInput } from '../types/tickets';
import { supabase } from '../config/supabaseClient';

export const CreateTicket: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const renewalData = location.state?.renewalData;
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setUserId(session?.user?.id || null);
    };
    getUser();
  }, []);

  const getInitialValues = (): Partial<CreateTicketInput> | undefined => {
    if (!renewalData) return undefined;

    const { name, renewDate, urgency } = renewalData;
    
    let priority: 'High' | 'Medium' | 'Low' = 'Low';
    if (urgency === 'Urgent') priority = 'High';
    if (urgency === 'Soon') priority = 'Medium';

    return {
      title: `Renewal: ${name}`,
      description: `Please check renewal for ${name}, expiry ${renewDate}.\nStatus: ${urgency}`,
      priority,
      assigneeRole: 'Management',
    };
  };


  const handleSubmit = async (data: CreateTicketInput) => {
    if (!userId) {
        console.error("No user logged in");
        alert("You must be logged in to create a ticket.");
        return;
    }
    
    console.log('Submitting ticket:', data);
    try {
        const { ticket, error } = await createTicket({
            title: data.title,
            description: data.description,
            priority: data.priority,
            client_id: userId,
            attachments: data.attachments as File[]
        });
        
        if (error) throw error;

        if (ticket) {
            console.log('Ticket created:', ticket);
            navigate(`/tickets/${ticket.id}`);
        }
    } catch (err: any) {
        console.error('Failed to create ticket', err);
        alert(err.message || 'Failed to create ticket.');
    }
  };

  return (
    <TicketForm
      onSubmit={handleSubmit}
      onCancel={() => navigate('/tickets')}
      initialValues={getInitialValues()}
    />
  );
};
