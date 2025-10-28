import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [RouterModule]
})
export class SidebarComponent implements OnInit {

  sections = [
    { label: 'Overview', route: '/overview' },
    { label: 'Tasks', route: '/tasks' },
    { label: 'Projects', route: '/projects' }
  ];
  constructor(private router: Router) {}

  ngOnInit(): void {
    //make 1st route active by default
    this.router.navigate([this.sections[0].route]);
  }
}
