import { Component, NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/layout/header.component';
import { SidebarComponent } from './shared/layout/sidebar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, SidebarComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  schemas: [NO_ERRORS_SCHEMA]
})
export class App {
  protected readonly title = signal('task-management');
}
