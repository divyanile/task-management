import { createReducer, on, MetaReducer } from '@ngrx/store';
import { addProject, updateProject, deleteProject } from './project.actions';
import { Project } from './../../models/projects.model';

export interface ProjectState {
  projects: Project[];
}

// ✅ Utility: Check if running in browser
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

// ✅ Load projects from localStorage on app start
function loadProjectsFromLocalStorage(): Project[] {
  if (isBrowser()) {
    try {
      const storedProjects = localStorage.getItem('projects');
      return storedProjects ? JSON.parse(storedProjects) : [];
    } catch (error) {
      console.error('Error loading projects from localStorage:', error);
    }
  }
  return [];
}

export const initialState: ProjectState = {
  projects: loadProjectsFromLocalStorage(),
};

export const projectReducer = createReducer(
  initialState,

  // ➕ Add Project
  on(addProject, (state = initialState, { project }) => {
    const projectsArray = Array.isArray(state.projects) ? state.projects : [];
    const updatedProjects = [...projectsArray, project];
    if (isBrowser()) localStorage.setItem('projects', JSON.stringify(updatedProjects));
    return { ...state, projects: updatedProjects };
  }),

  // ✏️ Update Project
  on(updateProject, (state, { project }) => {
    const updatedProjects = state.projects.map((p) =>
      p.id === project.id ? { ...p, ...project } : p
    );
    if (isBrowser()) localStorage.setItem('projects', JSON.stringify(updatedProjects));
    return { ...state, projects: updatedProjects };
  }),

  // 🗑 Delete Project
  on(deleteProject, (state, { projectId }) => {
    const updatedProjects = state.projects.filter((p) => p.id !== projectId);
    if (isBrowser()) localStorage.setItem('projects', JSON.stringify(updatedProjects));
    return { ...state, projects: updatedProjects };
  })
);

export const metaReducers: MetaReducer[] = [];
