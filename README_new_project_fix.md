
# New Project Feature Fix

This update implements a fully functional "Create Project" flow using a modal on the Projects page.

## Components Added/Modified

1.  **ProjectContext (`src/contexts/ProjectContext.tsx`)**:
    *   Manages the global state of projects.
    *   Exposes `projects`, `isLoading`, and `addProject`.
    *   Wraps the entire `App` to ensure data availability.

2.  **Mock API (`src/mocks/projectsApi.ts`)**:
    *   `getProjects()`: Simulates fetching data (latency enabled).
    *   `createProject(payload)`: Simulates validation and creation (latency enabled).

3.  **CreateProjectModal (`src/components/projects/CreateProjectModal.tsx`)**:
    *   Accessible dialog (focus trap, ARIA support).
    *   Form validation for Name and Client.
    *   Mock "Team Member" selection.

4.  **Projects Page (`src/pages/Projects.tsx`)**:
    *   Wired the "+ New Project" button to open the modal.
    *   Consumes `ProjectContext` for data display.

## How to Test

1.  Navigate to the **Projects** page.
2.  Click the **+ New Project** button.
3.  Verify the modal opens with focus trapped.
4.  Try submitting empty -> Observe validation errors.
5.  Fill in "Project Name" and "Client".
6.  Click "Create Project".
7.  Verify spinner appears, modal closes, and the new project appears in the grid immediately.

## Switching to Real Backend

To replace the mock API with a real backend:

1.  Open `src/mocks/projectsApi.ts`.
2.  Replace `getProjects` and `createProject` with `fetch` or `axios` calls.

Example:
```typescript
export const createProject = async (payload: Partial<Project>): Promise<Project> => {
  const response = await fetch('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error('Failed');
  return response.json();
};
```
