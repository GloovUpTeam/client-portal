// src/mocks/user.mock.ts
import { UserProfile, UserActivity } from '../types/user';

export const CURRENT_USER: UserProfile = {
  id: 'u1',
  name: 'Alice Freeman',
  email: 'alice.freeman@gloovup.com',
  role: 'PM',
  avatar: 'https://picsum.photos/id/1011/200',
  isOnline: true,
  phone: '+1 (555) 123-4567',
  company: 'Gloov Up',
  bio: 'Senior Project Manager with 8+ years of experience in digital transformation.',
  profileId: 'C-GLOOV-1023',
  website: 'www.gloovup.com',
  status: 'Active',
  lastLogin: '2025-11-28T09:00:00Z',
  createdAt: '2024-01-15T10:00:00Z',
  planType: 'Pro',
  stats: {
    ticketsRaised: 12,
    paymentsMade: 45000,
    pendingAmount: 2500,
    lastUpdated: '2025-11-28',
  }
};

export const RECENT_ACTIVITY: UserActivity[] = [
  { id: 'a1', action: 'Updated ticket', target: 'T-101: Login page formatting', timestamp: '2025-11-28T10:30:00Z' },
  { id: 'a2', action: 'Downloaded invoice', target: 'INV-2024-003', timestamp: '2025-11-27T14:15:00Z' },
  { id: 'a3', action: 'Changed status', target: 'T-102: Color palette', timestamp: '2025-11-26T09:45:00Z' },
  { id: 'a4', action: 'Logged in', target: 'Web Client', timestamp: '2025-11-26T09:00:00Z' },
  { id: 'a5', action: 'Commented on', target: 'T-103: Export report', timestamp: '2025-11-25T16:20:00Z' },
];

export const updateUserProfile = async (updates: Partial<UserProfile>): Promise<UserProfile> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const updated = { ...CURRENT_USER, ...updates };
      Object.assign(CURRENT_USER, updated);
      resolve(updated);
    }, 800);
  });
};
