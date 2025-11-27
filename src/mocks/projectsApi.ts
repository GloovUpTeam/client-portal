
import { Project, User } from '../types';
import { PROJECTS, USERS } from '../services/mockData';

// In-memory store initialized with mock data
// We use a let variable here so it persists during the session but resets on reload
let projectsStore: Project[] = [...PROJECTS];

const SIMULATED_DELAY = 600;

export const getProjects = async (): Promise<Project[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...projectsStore]);
    }, SIMULATED_DELAY);
  });
};

export const createProject = async (payload: Partial<Project>): Promise<Project> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate validation
      if (!payload.name) {
        reject(new Error('Project name is required'));
        return;
      }

      // Generate ID and timestamps
      const newProject: Project = {
        id: `proj_${Date.now()}`,
        name: payload.name || 'Untitled Project',
        client: payload.client || 'Internal',
        progress: 0,
        status: 'Active',
        dueDate: payload.dueDate || new Date().toISOString().split('T')[0],
        // Default to first user if no team selected
        team: payload.team && payload.team.length > 0 ? payload.team : [USERS[0]], 
        thumbnail: 'https://picsum.photos/seed/new/400/300',
        ...payload
      } as Project;

      // Optimistic update to store
      projectsStore = [newProject, ...projectsStore];

      resolve(newProject);
    }, SIMULATED_DELAY + Math.random() * 400);
  });
};
