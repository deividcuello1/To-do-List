import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { TaskService } from '../home/services/task/task-service';
import { UserService } from '../../core/auth/services/user-service';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { Task } from '../../core/models/task';
import { AngleLeft } from '@primeicons/angular/angle-left';
import { ArrowLeft } from '@primeicons/angular/arrow-left';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  imports: [RouterLink, AngleLeft, ArrowLeft, ProgressSpinnerModule],
  selector: 'app-task-by-id',
  styleUrl: './task-by-id.css',
  templateUrl: './task-by-id.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskById {
  taskService = inject(TaskService);
  userService = inject(UserService);
  router = inject(Router);
  task = signal<Task | undefined>(undefined);
  private activatedRoute = inject(ActivatedRoute);
  taskId = this.activatedRoute.snapshot.params['id'];
  userId = JSON.parse(localStorage.getItem('user') ?? '[]')[0].id;
  errorMsg = false;
  readonly userNames = this.taskService.userNames;

  ngOnInit() {
    this.taskService.getTaskById(this.taskId).subscribe(
      (response) => {
        this.task.set(response['data']);
      },
      (error) => {
        if(error.status == 404){
          this.router.navigate(['**'])
        };
      },
    );
  }
}
