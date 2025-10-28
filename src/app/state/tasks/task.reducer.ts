import { createReducer, on, MetaReducer } from '@ngrx/store';
import { addTask, updateTask, deleteTask, loadTasksSuccess } from './task.actions';
import { Task } from './../../models/task.model';

export interface TaskState {
  tasks: Task[];
}

// ✅ Utility: Safe check for browser environment
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}


function loadTasksFromLocalStorage(): Task[] {
  if (isBrowser()) {
    try {
      const storedTasks = localStorage.getItem('tasks');
      return storedTasks ? JSON.parse(storedTasks) : [];
    } catch (error) {
      console.error('Error loading tasks from localStorage:', error);
    }
  }
  return []; 
}

export const initialState: TaskState = {
  tasks: loadTasksFromLocalStorage(),
};

export const taskReducer = createReducer(
  initialState,

  on(addTask, (state = initialState, { task }) => {
    const tasksArray = Array.isArray(state.tasks) ? state.tasks : [];
    const updatedTasks = [...tasksArray, task];
    if (isBrowser()) localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    return { ...state, tasks: updatedTasks };
  }),

  on(updateTask, (state, { task }) => {
    const updatedTasks = state.tasks.map((t) =>
      t.id === task.id ? { ...t, ...task } : t
    );
    if (isBrowser()) localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    return { ...state, tasks: updatedTasks };
  }),

  on(deleteTask, (state, { taskId }) => {
    const updatedTasks = state.tasks.filter((t) => t.id !== taskId);
    if (isBrowser()) localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    return { ...state, tasks: updatedTasks };
  }),

  on(loadTasksSuccess, (state, { tasks }) => ({
    ...state,
    tasks,
  }))
);

export const metaReducers: MetaReducer[] = [];
