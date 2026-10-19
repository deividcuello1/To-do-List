import { Component, inject } from '@angular/core';
import { TaskService } from '../../services/task/task-service';

@Component({
  imports: [],
  selector: 'app-counter',
  styleUrl: './counter.css',
  templateUrl: './counter.html',
})
export class Counter {
  private taskService: TaskService = inject(TaskService);
  // doneTasksCounter = this.taskService.doneTasksCounter;
  // pendingTasksCounter = this.taskService.pendingTasksCounter;
  // inProgressTasksCounter = this.taskService.inProgressTasksCounter;
  statusCounter = this.taskService.statusCounter;
}
