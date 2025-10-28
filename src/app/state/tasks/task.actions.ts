import { createAction, props } from '@ngrx/store';
import { Task } from '../../models/task.model';

export const addTask = createAction('[Task] Add Task', props<{ task: Task }>());
export const updateTask = createAction('[Task] Update Task', props<{ task: Partial<Task> }>());
export const deleteTask = createAction('[Task] Delete Task', props<{ taskId: string }>());
export const loadTasks = createAction('[Task] Load Tasks');
export const loadTasksSuccess = createAction('[Task] Load Tasks Success', props<{ tasks: Task[] }>());
