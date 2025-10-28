import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAllProjects } from './../../state/projects/project.selectors';
import { selectAllTasks } from './../../state/tasks/task.selectors';
import { combineLatest, map, Observable } from 'rxjs';
import { Project } from './../../models/projects.model';
import { Task } from './../../models/task.model';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent {
  overviewData$: Observable<
    { project: Project; totalTasks: number; notStarted: number; inProgress: number; completed: number }[]
  >;

  constructor(private store: Store) {
    const projects$ = this.store.select(selectAllProjects);
    const tasks$ = this.store.select(selectAllTasks);

    this.overviewData$ = combineLatest([projects$, tasks$]).pipe(
      map(([projects, tasks]) =>
        projects.map((project) => {
          const projectTasks = tasks.filter((t) => project.taskIds.includes(t.id));

          const notStarted = projectTasks.filter((t) => t.status === 'Not Started').length;
          const inProgress = projectTasks.filter((t) => t.status === 'In Progress').length;
          const completed = projectTasks.filter((t) => t.status === 'Completed').length;

          return {
            project,
            totalTasks: projectTasks.length,
            notStarted,
            inProgress,
            completed,
          };
        })
      )
    );
  }
}
