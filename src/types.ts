export interface User {
  id: string;
  name: string;
  email?: string;
  role: 'Admin' | 'PM' | 'Client' | 'Dev' | 'Management' | 'Developer' | 'Marketing';
  avatar: string;
  isOnline?: boolean;
}

export interface Ticket {
  id: string;
  title: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  createdDate: string;
  assignee?: User;
  messages: number;
}

export interface Invoice {
  id: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  date: string;
  dueDate: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  attachments?: string[];
  status: 'sent' | 'delivered' | 'read';
}

export interface ChartData {
  name: string;
  value: number;
}
