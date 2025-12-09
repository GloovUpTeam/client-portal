import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, Clock } from "lucide-react";

import { DateRangeFilter, DateRange } from "../components/dashboard/DateRangeFilter";

import {
  DashboardProjectStatusCard,
  DashboardNextMilestoneCard,
  DashboardTeamAssignedCard,
  DashboardTicketsSummaryCard,
  DashboardPaymentDueCard,
  DashboardRenewalAlertsCard,
} from "../components/dashboard";

import { PendingPaymentsCard } from "../components/invoices/PendingPaymentsCard";
import { useAuth } from "../contexts/AuthContext";
import { useTickets } from "../hooks/useTickets";
import { supabase } from "../config/supabaseClient";

import { loadDashboard } from '../services/dashboardService';
import { InvoiceDetail, Renewal } from "../types/invoices";
import { Project } from "../types/projects";
import { ErrorBoundary } from "../components/ErrorBoundary";


// -------------------------
// Stat card component
// -------------------------
const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
}> = ({ title, value, icon: Icon, trend }) => (
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
    {trend && <p className="text-xs text-brand mt-4 font-medium">{trend}</p>}
  </div>
);


// -------------------------
// MAIN DASHBOARD COMPONENT
// -------------------------
export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tickets, fetchTickets } = useTickets();

  const [projects, setProjects] = useState<Project[]>([]);
  const [invoices, setInvoices] = useState<InvoiceDetail[]>([]);
  const [renewals, setRenewals] = useState<Renewal[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>();
  const [loading, setLoading] = useState(true);

  // -------------------------
  // Fetch all dashboard data
  // -------------------------











  useEffect(() => {
    let ignore = false;
    const run = async () => {
      if (!user) return;
      setLoading(true);
      try {
        await fetchTickets();
        const data = await loadDashboard(user.id);
        if (ignore) return;
        setProjects(data.projects);
        setInvoices(data.invoices as any);
        setRenewals(data.renewals as any);
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    run();
    return () => { ignore = true; };
  }, [user, fetchTickets]);

  if (loading) return <div className="text-white p-6">Loading dashboard...</div>;


  // -------------------------
  // DERIVED DATA
  // -------------------------

  const openTickets = (tickets || []).filter(
    (t) => t.status === "open" || t.status === "in_progress"
  );

  const pendingTicketsCount = (tickets || []).filter(
    (t) => t.status === "open"
  ).length;

  const ticketsSummary = {
    totalOpen: openTickets.length,
    highPriority: openTickets.filter(
      (t) => t.priority === "high" || t.priority === "urgent"
    ).length,
    latest: (tickets || []).slice(0, 3).map((t) => ({
      id: t.id,
      title: t.title,
      priority: t.priority,
      status: t.status,
      updatedAt: t.updated_at,
    })),
  };

  const activeProject = projects[0] || null;


  // -------------------------
  // RENDER
  // -------------------------
  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-neutral-400">Welcome back, here’s what’s happening today.</p>
        </div>

        <DateRangeFilter onChange={setDateRange} />
      </div>


      {/* TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Projects"
          value={projects.length}
          icon={Activity}
        />
        <StatCard
          title="Pending Tickets"
          value={pendingTicketsCount}
          icon={Clock}
          trend="+2 from last month"
        />
      </div>


      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-6">
          <ErrorBoundary>
            <DashboardProjectStatusCard project={activeProject} />
          </ErrorBoundary>

          <ErrorBoundary>
            <DashboardTicketsSummaryCard summary={ticketsSummary} />
          </ErrorBoundary>

          <ErrorBoundary>
            <DashboardRenewalAlertsCard renewals={renewals} />
          </ErrorBoundary>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">
          <ErrorBoundary>
            <PendingPaymentsCard
              invoices={invoices.filter(
                (i) => i.status === "Pending" || i.status === "Overdue"
              )}
            />
          </ErrorBoundary>

          <ErrorBoundary>
            <DashboardTeamAssignedCard team={[]} />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};
