import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Clock } from 'lucide-react';
import { DateRangeFilter, DateRange } from '../components/dashboard/DateRangeFilter';
import {
  DashboardProjectStatusCard,
  DashboardNextMilestoneCard,
  DashboardTeamAssignedCard,
  DashboardTicketsSummaryCard,
  DashboardPaymentDueCard,
  DashboardRenewalAlertsCard,
  TicketsSummaryCard,
} from '../components/dashboard';
import { PendingPaymentsCard } from '../components/invoices/PendingPaymentsCard';
import { RenewalRemindersCard } from '../components/invoices/RenewalRemindersCard';
import { fetchInvoicesForClient } from '../services/invoiceService';
import { fetchTicketsForClient } from '../services/ticketsService';
import { projectsService } from '../services/projectsService';
import { InvoiceDetail, Renewal } from '../types/invoices';
import { TicketDetail } from '../types/tickets';
import { Project } from '../types/projects';
import { supabase } from '../config/supabaseClient';

const StatCard: React.FC<{ title: string; value: string; icon: React.ElementType; trend?: string }> = ({ title, value, icon: Icon, trend }) => (
  <div className="bg-brand-surface p-6 rounded-xl border border-neutral-800">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-neutral-400 font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-white mt-2">{value}</h3>
      </div>
      <div className="p-3 bg-neutral-800 rounded-lg text-brand">
        <Icon className="w-6 h-6" />
      </div>
    </div>
    {trend && <p className="text-xs text-brand mt-4 font-medium">{trend} from last month</p>}
  </div>
);

import { ErrorBoundary } from '../components/ErrorBoundary';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  
  const [invoices, setInvoices] = useState<InvoiceDetail[]>([]);
  const [renewals, setRenewals] = useState<Renewal[]>([]);
  const [tickets, setTickets] = useState<TicketDetail[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
            setLoading(false);
            return;
        }
        const userId = session.user.id;

        const [invRes, tickRes, projData] = await Promise.all([
          fetchInvoicesForClient(userId),
          fetchTicketsForClient(userId),
          projectsService.getProjects()
        ]);
        // Temporarily disable renewals fetch until table is created
        const renData: Renewal[] = []; 
        
        // Map Invoices
        const mappedInvoices: InvoiceDetail[] = (invRes.data || []).map(i => ({
            id: i.id,
            number: i.invoice_number,
            clientId: i.client_id || userId,
            clientName: 'Client',
            amount: i.total || 0,
            status: (i.status as any) || 'Pending',
            date: i.issued_date || new Date().toISOString(),
            dueDate: i.due_date || new Date().toISOString(),
            items: [],
            total: i.total || 0,
            client: { name: 'Client' },
            subtotal: i.total || 0,
            tax: 0,
            taxRate: 0
        }));

        // Map Tickets
        const mappedTickets: TicketDetail[] = (tickRes.data || []).map(t => ({
            id: t.id,
            title: t.title,
            description: t.description || '',
            priority: (t.priority as any) || 'Medium',
            status: (t.status as any) || 'Open',
            creatorId: t.client_id || userId,
            creator: { id: t.client_id || userId, name: 'User', email: '', avatar: '', role: 'Client' },
            assigneeId: t.assigned_to,
            attachments: [],
            comments: [],
            activities: [],
            createdAt: t.created_at || new Date().toISOString(),
            updatedAt: t.created_at || new Date().toISOString(),
            progress: 0
        }));

        setInvoices(mappedInvoices);
        setRenewals(renData || []);
        setTickets(mappedTickets);
        setProjects(projData || []);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-white p-6">Loading dashboard...</div>;

  // Derived data for widgets
  const activeProject = projects[0]; // Just take first for now
  const activeTickets = (tickets || []).filter(t => t.status === 'Open' || t.status === 'In Progress');
  const pendingTicketsCount = (tickets || []).filter(t => t.status === 'Open').length;
  
  // Mock team for now or fetch from project members
  const team = [
    { id: '1', name: 'Alice Freeman', role: 'Project Manager', avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: '2', name: 'Bob Smith', role: 'Developer', avatar: 'https://i.pravatar.cc/150?u=2' },
  ];

  const ticketsSummary = {
    totalOpen: activeTickets.length,
    highPriority: activeTickets.filter(t => t.priority === 'High' || t.priority === 'Critical').length,
    latest: (tickets || []).slice(0, 3).map(t => ({
        id: t.id,
        title: t.title,
        priority: t.priority,
        status: t.status,
        updatedAt: t.updatedAt
    }))
  };

  // Payment due logic (mocked or derived)
  const paymentDue = {
      amount: 1200,
      dueDate: '2024-10-15',
      invoiceNumber: 'INV-2024-001'
  }; 

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-neutral-400">Welcome back, here's what's happening today.</p>
        </div>
        <DateRangeFilter onChange={setDateRange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Projects" value={projects.length.toString()} icon={Activity} />
        <StatCard title="Pending Tickets" value={pendingTicketsCount.toString()} icon={Clock} trend="+2" />
        {/* Add more stat cards as needed */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ErrorBoundary>
             <DashboardProjectStatusCard project={activeProject} />
          </ErrorBoundary>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <ErrorBoundary>
               <TicketsSummaryCard dateRange={dateRange} />
             </ErrorBoundary>
             <ErrorBoundary>
               <DashboardRenewalAlertsCard renewals={renewals} />
             </ErrorBoundary>
          </div>
        </div>
        <div className="space-y-6">
           <ErrorBoundary>
             <PendingPaymentsCard invoices={invoices.filter(i => i.status === 'Overdue' || i.status === 'Pending')} />
           </ErrorBoundary>
           <ErrorBoundary>
             <DashboardTeamAssignedCard team={team} />
           </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};
