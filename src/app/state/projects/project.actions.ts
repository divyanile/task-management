import { createAction, props } from '@ngrx/store';
import { Project } from './../../models/projects.model';

export const addProject = createAction('[Project] Add Project', props<{ project: Project }>());
export const updateProject = createAction('[Project] Update Project', props<{ project: Project }>());
export const deleteProject = createAction('[Project] Delete Project', props<{ projectId: string }>());
