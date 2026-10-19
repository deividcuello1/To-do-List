import {
  Component,
  Output,
  EventEmitter,
  input,
  output,
  OnInit,
  signal,
  effect,
  inject,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { Task } from '../../../../core/models/task';
import { TaskService } from '../../services/task/task-service';
import { Router } from '@angular/router';
import { AddTaskDialog } from '../../../../shared/components/add-task-dialog/add-task-dialog';

@Component({
  imports: [NgClass, AddTaskDialog],
  host: {
    style: 'display: contents',
  },
  selector: 'app-task-item-component',
  styleUrl: './task-item-component.css',
  templateUrl: './task-item-component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskItemComponent {
  @ViewChild('childTemplate', { static: true }) childTemplate: TemplateRef<any>;

  // item = input<string>();
  // id = input<string>();
  // index = input<number>();
  task = input<Task>();
  completedChanged = output<string>();
  deletedChanged = output<string>();
  isCompleted = input<boolean>();
  isCompletedTemp: boolean | undefined = false;
  private taskService: TaskService = inject(TaskService);
  readonly data = this.taskService.taskList;
  router = inject(Router);

  constructor() {
    effect(() => {
      this.isCompletedTemp = this.isCompleted();
    });
  }

  openTask() {
    this.router.navigate([`/tareas/${this.task()!.id}`]);
  }

  notifyParentCompleted() {
    this.completedChanged.emit(
      `La tarea con Id: ${this.task()!.id} ha sido completada. Aqui se aplica @Input()`,
    );
  }

  notifyParentDeleted() {
    this.completedChanged.emit(
      `La tarea con Id: ${this.task()!.id} ha sido eliminada. Aqui se aplica @Output()`,
    );
  }

  putTaskDone() {
    // this.taskService.changeStatus(Number(this.task()!.id), 'done');
  }

  putTaskInProgress() {
    // this.taskService.changeStatus(Number(this.task()!.id), 'in_progress');
  }

  putTaskPending() {
    // this.taskService.changeStatus(Number(this.task()!.id), 'pending');
  }

  removeTask() {
    this.taskService.removeData(Number(this.task()!.id));
  }

  ngOnInit() {
    this.isCompletedTemp = this.isCompleted() ?? false;
  }
}
