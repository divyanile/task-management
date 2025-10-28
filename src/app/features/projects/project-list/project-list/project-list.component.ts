import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { addProject, updateProject, deleteProject } from './../../../../state/projects/project.actions';
import { selectAllProjects } from './../../../../state/projects/project.selectors';
import { selectAllTasks } from './../../../../state/tasks/task.selectors';
import { Project } from '../../../../models/projects.model';
import { ConfirmPopupComponent } from './../../../../shared/ui/confirm-popup/confirm-popup.component';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ConfirmPopupComponent],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
})
export class ProjectListComponent {
  projects$;
  tasks$;

  projectForm: FormGroup;
  isModalOpen = false;
  isEditMode = false;

  // ✅ popup control variables
  isPopupOpen = false;
  selectedProjectId: string | null = null;

  constructor(private fb: FormBuilder, private store: Store) {
    this.projects$ = this.store.select(selectAllProjects);
    this.tasks$ = this.store.select(selectAllTasks);
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      taskIds: this.fb.control<string[]>([], { nonNullable: true }),
    });
  }

  openModal() {
    this.isModalOpen = true;
    this.isEditMode = false;
    this.projectForm.reset({ name: '', description: '', taskIds: [] });
  }

  closeModal() {
    this.isModalOpen = false;
  }

  addOrUpdateProject() {
    const formValue = this.projectForm.value;

    if (this.isEditMode && this.projectForm.get('id')?.value) {
      this.store.dispatch(updateProject({ project: { ...formValue, id: this.projectForm.get('id')?.value } }));
    } else {
      const newProject: Project = {
        id: Date.now().toString(),
        name: formValue.name,
        description: formValue.description,
        taskIds: formValue.taskIds,
        createdAt: new Date().toISOString(),
      };
      this.store.dispatch(addProject({ project: newProject }));
    }

    this.closeModal();
  }

  editProject(project: Project) {
    this.isEditMode = true;
    this.isModalOpen = true;
    this.projectForm.patchValue(project);
    if (!this.projectForm.get('id')) {
      this.projectForm.addControl('id', this.fb.control(project.id));
    }
  }

  // ✅ open confirm popup instead of directly deleting
  openDeletePopup(id: string) {
    this.selectedProjectId = id;
    this.isPopupOpen = true;
  }

  handleConfirmDelete() {
    if (this.selectedProjectId) {
      this.store.dispatch(deleteProject({ projectId: this.selectedProjectId }));
    }
    this.isPopupOpen = false;
    this.selectedProjectId = null;
  }

  handleCancelDelete() {
    this.isPopupOpen = false;
    this.selectedProjectId = null;
  }

  toggleTaskSelection(taskId: string, event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const currentTaskIds = this.projectForm.value.taskIds || [];

    if (checkbox.checked) {
      this.projectForm.get('taskIds')?.setValue([...currentTaskIds, taskId]);
    } else {
      this.projectForm.get('taskIds')?.setValue(currentTaskIds.filter((id: string) => id !== taskId));
    }
  }

  //get task name by id
  getTaskName(taskId: string): string {
    let taskName = '';
    this.tasks$.subscribe((tasks) => {
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        taskName = task.title;
      }
    }).unsubscribe();
    return taskName;
  }
}
