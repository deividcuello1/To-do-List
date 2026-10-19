import { Component } from '@angular/core';
import { TaskItemComponent } from './components/task-item-component/task-item-component';
import { TaskListComponent } from './components/task-list-component/task-list-component';

@Component({
  imports: [TaskItemComponent, TaskListComponent],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {

}
