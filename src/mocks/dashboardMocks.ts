import { User } from '../types';

export interface DashboardProject {
  id: string;
  name: string;
  progress: number;
  milestones: Milestone[];
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  id: string;
  title: string;
  date: string;
}

export interface TeamMember {
  id: string;
  name: string;
  avatarUrl?: string;
  profileUrl?: string;
  joinedAt: string;
}

export interface TicketSummary {
  totalOpen: number;
  highPriority: number;
}

export interface InvoiceDue {
  totalOverdue: number;
  nearestDueDate?: string;
}

export interface Renewal {
  id: string;
  name: string;
  type: 'domain' | 'hosting';
  renewDate: string;
}

export const DASHBOARD_PROJECT: DashboardProject = {
  id: 'proj_01',
  name: 'Website Redesign',
  progress: 68,
  createdAt: '2025-10-01',
  updatedAt: '2025-11-20',
  milestones: [
    { id: 'm1', title: 'Design Review', date: '2025-11-30' },
    { id: 'm2', title: 'Development Phase', date: '2025-12-15' },
    { id: 'm3', title: 'Launch', date: '2026-01-10' },
  ]
};

export const DASHBOARD_TEAM: TeamMember[] = [
  { id: 'u1', name: 'Alice Freeman', avatarUrl: 'https://picsum.photos/id/1011/200', profileUrl: '#', joinedAt: '2024-01-15' },
  { id: 'u2', name: 'Bob Smith', avatarUrl: 'https://picsum.photos/id/1012/200', profileUrl: '#', joinedAt: '2024-02-20' },
  { id: 'u3', name: 'Charlie Client', avatarUrl: 'https://picsum.photos/id/1025/200', profileUrl: '#', joinedAt: '2024-03-10' },
  { id: 'u4', name: 'Diana Dev', avatarUrl: 'https://picsum.photos/id/1027/200', profileUrl: '#', joinedAt: '2024-04-05' },
  { id: 'u5', name: 'Eve Designer', avatarUrl: 'https://picsum.photos/id/1035/200', profileUrl: '#', joinedAt: '2024-05-12' },
];

export const DASHBOARD_TICKETS: TicketSummary = {
  totalOpen: 8,
  highPriority: 3,
};

export const DASHBOARD_PAYMENT: InvoiceDue = {
  totalOverdue: 2500,
  nearestDueDate: '2025-12-05',
};

export const DASHBOARD_RENEWALS: Renewal[] = [
  { id: 'r1', name: 'gloovup.com', type: 'domain', renewDate: '2025-12-01' },
  { id: 'r2', name: 'AWS Hosting - Production', type: 'hosting', renewDate: '2025-12-15' },
  { id: 'r3', name: 'staging.gloovup.com', type: 'domain', renewDate: '2026-01-20' },
];
