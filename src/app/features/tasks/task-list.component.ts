import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { addTask, updateTask, deleteTask } from './../../state/tasks/task.actions';
import { selectAllTasks } from '../../state/tasks/task.selectors';
import { APP_CONSTANTS } from '../../app.constants';
import { Task } from '../../models/task.model';
import { ConfirmPopupComponent } from '../../shared/ui/confirm-popup/confirm-popup.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,  ConfirmPopupComponent],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent {
  tasks$

  isModalOpen = false;
  isEditMode = false;
  taskFormGroup: FormGroup;

  // For delete confirmation popup
  isPopupOpen = false;
  taskIdToDelete: string | null = null;

  DROPDOWN_OPTIONS = APP_CONSTANTS.DROPDOWN_OPTIONS.STATUS;
  LABELS = APP_CONSTANTS.LABELS;

  constructor(private store: Store, private fb: FormBuilder) {
  this.tasks$ = this.store.select(selectAllTasks);
    this.taskFormGroup = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      dueDate: ['', Validators.required],
      priority: ['', Validators.required],
      status: ['Not Started', Validators.required],
    });
  }

  /** 🟢 Open modal for new task */
  openTaskModal(): void {
    this.isModalOpen = true;
    this.isEditMode = false;
    this.taskFormGroup.reset({
      title: '',
      description: '',
      dueDate: '',
      priority: '',
      status: 'Not Started',
    });
  }

  /** 🔴 Close modal */
  closeTaskModal(): void {
    this.isModalOpen = false;
  }

  /** 🧠 Add or update task */
  addOrUpdateTask(): void {
    if (this.taskFormGroup.invalid) return;

    const taskData = this.taskFormGroup.value;

    if (this.isEditMode && this.taskFormGroup.get('id')?.value) {
      this.store.dispatch(
        updateTask({ task: { ...taskData, id: this.taskFormGroup.get('id')?.value } })
      );
    } else {
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString(),
        completed: false,
        createdAt: new Date().toISOString(),
      };
      this.store.dispatch(addTask({ task: newTask }));
    }

    this.closeTaskModal();
  }

  /** ✏️ Edit an existing task */
  editTask(task: Task): void {
    this.isModalOpen = true;
    this.isEditMode = true;

    if (!this.taskFormGroup.get('id')) {
      this.taskFormGroup.addControl('id', this.fb.control(task.id));
    } else {
      this.taskFormGroup.get('id')?.setValue(task.id);
    }

    this.taskFormGroup.patchValue(task);
  }

  /** 🗑 Trigger delete confirmation */
  openDeletePopup(taskId: string): void {
    this.isPopupOpen = true;
    this.taskIdToDelete = taskId;
  }

  /** ✅ Confirm delete */
  handleConfirmDelete(): void {
    if (this.taskIdToDelete) {
      this.store.dispatch(deleteTask({ taskId: this.taskIdToDelete }));
    }
    this.closeDeletePopup();
  }

  /** ❌ Cancel delete */
  handleCancelDelete(): void {
    this.closeDeletePopup();
  }

  /** 🧹 Close delete popup */
  closeDeletePopup(): void {
    this.isPopupOpen = false;
    this.taskIdToDelete = null;
  }
}
