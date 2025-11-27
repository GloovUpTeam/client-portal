import { Project, Ticket, Invoice, User, ChatMessage } from '../types';

export const USERS: User[] = [
  { id: 'u1', name: 'Alice Freeman', role: 'PM', avatar: 'https://picsum.photos/id/1011/200', isOnline: true },
  { id: 'u2', name: 'Bob Smith', role: 'Dev', avatar: 'https://picsum.photos/id/1012/200', isOnline: false },
  { id: 'u3', name: 'Charlie Client', role: 'Client', avatar: 'https://picsum.photos/id/1025/200', isOnline: true },
];

export const PROJECTS: Project[] = [
  {
    id: 'proj_01',
    name: 'Website Redesign',
    client: 'Acme Corp',
    progress: 68,
    status: 'Active',
    dueDate: '2024-12-01',
    team: [USERS[0], USERS[1]],
    nextMilestone: { title: 'Design Review', date: '2024-10-15' },
    thumbnail: 'https://picsum.photos/id/1/400/300'
  },
  {
    id: 'proj_02',
    name: 'Mobile App MVP',
    client: 'Starlight Inc',
    progress: 32,
    status: 'Paused',
    dueDate: '2025-01-20',
    team: [USERS[0]],
    nextMilestone: { title: 'API Integration', date: '2024-11-01' },
    thumbnail: 'https://picsum.photos/id/2/400/300'
  },
  {
    id: 'proj_03',
    name: 'Marketing Dashboard',
    client: 'DataFlow',
    progress: 90,
    status: 'Review',
    dueDate: '2024-10-10',
    team: [USERS[1]],
    nextMilestone: { title: 'Final QA', date: '2024-10-08' },
    thumbnail: 'https://picsum.photos/id/3/400/300'
  }
];

export const TICKETS: Ticket[] = [
  { id: 'T-101', title: 'Login page formatting issue on mobile', status: 'Open', priority: 'High', createdDate: '2024-10-01', assignee: USERS[1], messages: 3 },
  { id: 'T-102', title: 'Update color palette in settings', status: 'In Progress', priority: 'Medium', createdDate: '2024-10-02', assignee: USERS[0], messages: 5 },
  { id: 'T-103', title: 'Export report fails with 500 error', status: 'Resolved', priority: 'Critical', createdDate: '2024-09-28', assignee: USERS[1], messages: 12 },
  { id: 'T-104', title: 'Add new user role', status: 'Closed', priority: 'Low', createdDate: '2024-09-15', assignee: USERS[0], messages: 2 },
];

export const INVOICES: Invoice[] = [
  { id: 'INV-2024-001', amount: 5000, status: 'Paid', date: '2024-08-01', dueDate: '2024-08-15' },
  { id: 'INV-2024-002', amount: 2500, status: 'Overdue', date: '2024-09-01', dueDate: '2024-09-15' },
  { id: 'INV-2024-003', amount: 7500, status: 'Pending', date: '2024-10-01', dueDate: '2024-10-15' },
];

export const MOCK_CHAT: ChatMessage[] = [
  { id: 'm1', senderId: 'u1', text: 'Hey Charlie, how does the new dashboard look?', timestamp: '10:00 AM', status: 'read' },
  { id: 'm2', senderId: 'u3', text: 'It looks great! I love the dark mode.', timestamp: '10:05 AM', status: 'read' },
  { id: 'm3', senderId: 'u1', text: 'Awesome. We are deploying the updates tonight.', timestamp: '10:06 AM', status: 'delivered' },
];

export const getProjectStats = () => [
  { name: 'Completed', value: 12 },
  { name: 'Active', value: 5 },
  { name: 'On Hold', value: 2 },
];
