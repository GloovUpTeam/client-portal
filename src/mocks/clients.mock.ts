export interface ClientTeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface Client {
  id: string;
  name: string;
  contactPerson: string;
  clientId: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  status: 'Active' | 'In Progress' | 'Paused';
  domainExpiry: string;
  hostingExpiry: string;
  team: ClientTeamMember[];
}

export const MOCK_CLIENT: Client = {
  id: 'c1',
  name: 'Acme Corp',
  contactPerson: 'John Doe',
  clientId: 'CL-ACME-001',
  website: 'https://acme.com',
  email: 'contact@acme.com',
  phone: '+1 (555) 000-0000',
  address: '123 Acme St, Tech City',
  status: 'Active',
  domainExpiry: '2025-12-31',
  hostingExpiry: '2025-11-30',
  team: [
    { id: 't1', name: 'Alice Freeman', role: 'Manager', avatar: 'https://picsum.photos/id/1011/100' },
    { id: 't2', name: 'Bob Smith', role: 'Developer', avatar: 'https://picsum.photos/id/1012/100' },
    { id: 't3', name: 'Charlie Brown', role: 'Designer' }, // No avatar
    { id: 't4', name: 'David Lee', role: 'Support' },
  ]
};
