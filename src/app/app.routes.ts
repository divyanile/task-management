import { Routes } from '@angular/router';
import { TASK_ROUTES } from './features/tasks/task.routes';
import { OVERVIEW_ROUTES } from './features/overview/overview.routes';

export const routes: Routes = [
  { path: 'overview', loadChildren: () => OVERVIEW_ROUTES },
  { path: 'tasks', loadChildren: () => import('./features/tasks/task.routes').then(m => m.TASK_ROUTES) },
  { path: 'projects', loadChildren: () => import('./features/projects/project.routes').then(m => m.PROJECT_ROUTES) },
  { path: '', redirectTo: 'overview', pathMatch: 'full' },
];
