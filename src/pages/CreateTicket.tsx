import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TicketForm } from '../components/tickets/TicketForm';
import { useTickets } from '../hooks/useTickets';
import { useAuth } from '../contexts/AuthContext';
import { CreateTicketInput } from '../types/tickets';
import toast from 'react-hot-toast';

export const CreateTicket: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { createTicket } = useTickets();
  const { user, loading } = useAuth();
  const loadingRef = React.useRef(loading);
  const userRef = React.useRef(user);

  React.useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  React.useEffect(() => {
    userRef.current = user;
  }, [user]);
  const renewalData = location.state?.renewalData;

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
    let submitting = true;
    try {
      // If auth is still initializing, wait a short while for it to finish
      if (loadingRef.current) {
        await new Promise<void>((resolve) => {
          const start = Date.now();
          const interval = setInterval(() => {
            if (!loadingRef.current || Date.now() - start > 5000) {
              clearInterval(interval);
              resolve();
            }
          }, 100);
        });
      }

      // Check final auth state
      if (!userRef.current) {
        toast.error('You must be logged in to create a ticket');
        return;
      }

      const payload = {
        title: data.title,
        description: data.description,
        priority: data.priority.toLowerCase(),
        attachments: data.attachments
      };
      try {
        await createTicket(payload);
        toast.success('Ticket created successfully');
        navigate('/tickets');
      } catch (error: any) {
        console.error('[createTicket] failed', {
          message: error?.message,
          details: error?.details,
          request: payload
        });
        if (String(error).toLowerCase().includes('must be logged in')) {
          toast.error('You must be logged in to create a ticket');
        } else {
          toast.error('Failed to create ticket: ' + (error?.message || 'Unknown error'));
        }
      }
    } catch (err) {
      console.error('[CreateTicket] Unexpected error:', err);
      toast.error('An unexpected error occurred while creating the ticket.');
    } finally {
      submitting = false;
      // If you have a submitting/loading state, clear it here
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
