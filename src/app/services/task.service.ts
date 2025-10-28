import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../models/task.model';

function genId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  list() {
    return this.tasks$;
  }

  add(partial: Partial<Task>) {
    const now = new Date().toISOString();
    const task: Task = {
      id: genId(),
      title: partial.title ?? 'Untitled',
      description: partial.description ?? '',
      completed: partial.completed ?? false,
      dueDate: partial.dueDate,
      projectId: partial.projectId,
      createdAt: now,
      updatedAt: now,
    };
    this.tasksSubject.next([task, ...this.tasksSubject.value]);
    return task;
  }

  update(id: string, patch: Partial<Task>) {
    const updatedTasks = this.tasksSubject.value.map((t) =>
      t.id === id ? { ...t, ...patch, updatedAt: new Date().toISOString() } : t
    );
    this.tasksSubject.next(updatedTasks);
  }

  remove(id: string) {
    const updatedTasks = this.tasksSubject.value.filter((t) => t.id !== id);
    this.tasksSubject.next(updatedTasks);
  }

  getById(id: string) {
    return this.tasksSubject.value.find((t) => t.id === id) ?? null;
  }

  deleteTask(taskId: string): void {
    const updatedTasks = this.tasksSubject.value.filter((task) => task.id !== taskId);
    this.tasksSubject.next(updatedTasks);
  }

  addTask(task: Task): void {
    const updatedTasks = [task, ...this.tasksSubject.value];
    this.tasksSubject.next(updatedTasks);
  }

  updateTask(updatedTask: Partial<Task>): void {
    const tasks = this.tasksSubject.value.map((task) =>
      task.id === updatedTask.id ? { ...task, ...updatedTask } : task
    );
    this.tasksSubject.next(tasks);
  }
}
