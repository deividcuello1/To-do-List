import {
  Component,
  inject,
  ChangeDetectionStrategy,
  OnInit,
  signal,
  effect,
  ViewChild,
} from '@angular/core';
import { Task } from '../../../../core/models/task';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task/task-service';
import { Counter } from '../counter/counter';
import { HttpClient } from '@angular/common/http';
import { DialogModule } from 'primeng/dialog';
import { AddTaskDialog } from '../../../../shared/components/add-task-dialog/add-task-dialog';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { ButtonDirective } from 'primeng/button';
import { Table } from 'primeng/table';
import { Trash } from '@primeicons/angular/trash';
import { FileEdit } from '@primeicons/angular/file-edit';
import { Plus } from '@primeicons/angular/plus';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { Eye } from '@primeicons/angular/eye';
import { UserService } from '../../../../core/auth/services/user-service';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  imports: [
    FormsModule,
    Counter,
    DialogModule,
    AddTaskDialog,
    TableModule,
    SelectModule,
    ButtonDirective,
    Trash,
    FileEdit,
    ConfirmDialogModule,
    Eye,
    Plus,
    IconFieldModule,
    InputIconModule,
  ],
  providers: [ConfirmationService],
  selector: 'app-task-list-component',
  styleUrl: './task-list-component.css',
  templateUrl: './task-list-component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListComponent {
  @ViewChild('dt') table: Table;
  @ViewChild('selectedStatusOption') selectedStatusOption1: any;
  private taskService: TaskService = inject(TaskService);
  private userService = inject(UserService);
  private http = inject(HttpClient);
  readonly filteredTasks = this.taskService.taskListFiltered;
  readonly recordCounter = this.taskService.recordCounter;
  readonly userNames = this.taskService.userNames;
  router = inject(Router);
  taskData = {};
  dialogVisibility = signal<boolean>(false);
  currentPage = signal<number>(0);
  titleFilter = signal<string>('');
  pageSize = signal<number>(10);
  statusFilter = signal<string>('');
  priorityFilter = signal<string>('');
  readonly loading = this.taskService.loading;
  private confirmationService = inject(ConfirmationService);
  selectedStatusOption = '';
  selectedPriorityOption = '';
  selectedAssigneeIdsOption = '';
  userNamesOptionList = signal<object[]>([]);
  constructor() {
    effect(() => {
      if (!this.dialogVisibility()) {
        this.taskService.deactivateEdition();
      }
    });
    effect(() => {
      const users: any[] = [];
      for (const [key, value] of Object.entries(this.userNames())) {
        users.push({ label: value, value: key });
      }
      this.userNamesOptionList.set(users);
    });
  }

  openTask(id: number) {
    this.router.navigate([`/tareas/${id}`]);
  }

  confirm1(event: Event, id) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Estas seguro que deseas eliminar la tarea con id ${id}?`,
      header: 'Dialogo de confirmacion',
      closable: true,
      closeOnEscape: true,
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Eliminar',
        severity: 'danger',
      },
      accept: () => {
        this.removeTask(id);
      },
      reject: () => {},
    });
  }

  loadTasks($event) {
    const title = $event.filters.title?.value;
    const status = $event.filters.status?.value.value;
    const priority = $event.filters.priority?.value.value;
    const assigneeId = $event.filters.assigneeId?.value.value;
    const sortBy = $event.sortField;
    const currentPage = $event.first / $event.rows + 1;
    const pageSize = $event.rows;
    this.currentPage.set(currentPage);
    this.pageSize.set(pageSize);
    this.titleFilter.set(title);
    this.statusFilter.set($event.filters.status?.value);
    this.priorityFilter.set($event.filters.priority?.value);
    this.taskService.applyFilters(
      currentPage,
      pageSize,
      title,
      status,
      priority,
      assigneeId,
      sortBy,
    );
  }

  addTask() {
    this.taskService.deactivateEdition();
    this.toggleDialogVisibility();
  }
  toggleDialogVisibility() {
    this.dialogVisibility.update((value: boolean) => !value);
  }

  handleDialogClose() {
    console.log('heey');
  }

  editingTask(task: Task) {
    this.taskService.activateEdition();
    this.taskData = task;
    this.toggleDialogVisibility();
  }

  handleSubmit(event: Event) {
    const form = event.target as HTMLFormElement;
  }

  onChildClick(message: string) {
    alert(message);
  }

  statusOptionList: any[] | undefined;

  priorityOptionList: any[] | undefined;

  removeTask(id: number) {
    this.taskService.removeData(id);
  }

  resetFilters() {
    this.taskService.getAllTasks();
  }

  ngOnInit() {
    this.statusOptionList = [
      { label: 'Todos', value: '' },
      { label: 'Pendientes', value: 'pending' },
      { label: 'En progreso', value: 'in_progress' },
      { label: 'Completados', value: 'done' },
    ];

    this.priorityOptionList = [
      { label: 'Todos', value: '' },
      { label: 'Baja', value: 'low' },
      { label: 'Media', value: 'medium' },
      { label: 'Alta', value: 'high' },
    ];
  }
}
