export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  bio?: string;
  role?: string;
  avatar: string;
  isOnline?: boolean;
  // New fields for profile redesign
  profileId?: string;
  website?: string;
  status?: 'Active' | 'Inactive' | 'Pending';
  lastLogin?: string;
  createdAt?: string;
  planType?: 'Free' | 'Pro' | 'Premium';
  stats?: {
    ticketsRaised: number;
    paymentsMade: number;
    pendingAmount: number;
    lastUpdated: string;
  };
}

export interface UserActivity {
  id: string;
  action: string;
  target: string;
  timestamp: string;
}
