export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string; // ISO date
  projectId?: string;
  createdAt: string;
  updatedAt?: string;
  priority?: string; // Added priority field
  status?: string; // Added status field
}
