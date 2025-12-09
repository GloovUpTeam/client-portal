import { User } from '../types';

export interface Attachment {
  id: string;
  name: string;
  url: string;
  size: number;
  mime: string;
  uploadedAt: string;
}

export interface TicketComment {
  id: string;
  ticketId: string;
  authorId: string;
  author: User;
  text: string;
  attachments?: Attachment[];
  createdAt: string;
}

export interface TicketActivity {
  id: string;
  ticketId: string;
  type: 'comment' | 'status_change' | 'priority_change' | 'assignment';
  userId: string;
  user: User;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface TicketDetail {
  id: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  assigneeId?: string;
  assigneeRole?: 'Management' | 'Developer' | 'Marketing';
  assignee?: User;
  creatorId: string;
  creator: User;
  attachments: Attachment[];
  comments: TicketComment[];
  activities: TicketActivity[];
  createdAt: string;
  updatedAt: string;
  progress: number; // 0-100
}

export interface CreateTicketInput {
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  assigneeId?: string;
  assigneeRole?: 'Management' | 'Developer' | 'Marketing';
  attachments?: File[];
}

export interface AddCommentInput {
  ticketId: string;
  text: string;
  attachments?: File[];
}
