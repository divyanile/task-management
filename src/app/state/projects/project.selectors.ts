import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProjectState } from './project.reducer';

export const selectProjectState = createFeatureSelector<ProjectState>('projects');
export const selectAllProjects = createSelector(selectProjectState, state => state.projects);
