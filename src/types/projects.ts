export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on_hold';
  client_id: string;
  start_date: string;
  end_date: string;
  progress: number;
  created_at: string;
  updated_at: string;
  milestones?: Milestone[];
  assets?: ProjectAsset[];
}

export interface Milestone {
  id: string;
  project_id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  due_date: string;
  created_at: string;
}

export interface ProjectAsset {
  id: string;
  name: string;
  url: string;
  size: number;
  mime_type: string;
  project_id: string;
  uploaded_by: string;
  created_at: string;
}
