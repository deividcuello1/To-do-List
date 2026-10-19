import { Service, signal, Injectable, effect, computed, inject, OnInit } from '@angular/core';
import { Task } from '../../../../core/models/task';
import { HttpClient } from '@angular/common/http';
import { Observable, pipe, map, forkJoin, switchMap, filter } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import { UserService } from '../../../../core/auth/services/user-service';
import { BaseResponse } from '../../../../shared/models/baseResponse';
import { ResponseGetData } from '../../../../shared/models/responseGetData';
import { User } from '../../../../core/models/user';

@Injectable({ providedIn: 'root' })
export class TaskService {
  // userId = JSON.parse(localStorage.getItem('user') ?? '[]')[0].id
  private API_URL = `${environment.API_URL}api/tasks`;
  private http = inject(HttpClient);
  private _taskList = signal<Task[]>([]);
  readonly taskList = this._taskList.asReadonly();
  private _loading = signal<boolean>(true);
  readonly loading = this._loading.asReadonly();
  // doneTasksCounter = computed(
  //   () => this._taskList().filter((value: Task) => value.status == 'done').length,
  // );
  // pendingTasksCounter = computed(
  //   () => this._taskList().filter((value: Task) => value.status == 'pending').length,
  // );
  // inProgressTasksCounter = computed(
  //   () => this._taskList().filter((value: Task) => value.status == 'in_progress').length,
  // );

  _recordCounter = signal<number>(0);
  readonly recordCounter = this._recordCounter.asReadonly();

  private userService = inject(UserService);

  private _isEditing = signal<boolean>(false);
  readonly isEditing = this._isEditing.asReadonly();

  private _userNames = signal<object>({ id: '' });
  readonly userNames = this._userNames.asReadonly();

  private _statusCounter = signal<object>({
    pending: 0,
    in_progress: 0,
    done: 0,
  });
  readonly statusCounter = this._statusCounter.asReadonly();

  constructor() {
    this.getAllTasks();
    this.counterByStatus();
    this.getUserNames();
  }

  activateEdition(): void {
    this._isEditing.set(true);
  }

  deactivateEdition(): void {
    this._isEditing.set(false);
  }

  callingTasksAPIWithPage(page): Observable<ResponseGetData<Task>> {
    return this.http.get<ResponseGetData<Task>>(`${this.API_URL}?page=${page}`);
  }

  callingUsersAPIWithPage(page) {
    return this.http.get<ResponseGetData<User>>(`http://127.0.0.1:3000/api/users?page=${page}`);
  }

  counterByStatus(): void  {
    this.http.get(this.API_URL).subscribe((response) => {
      let totalPages = response['data'].pageCount;
      const tasks = response['data'].result;
      for (let index = 0; index < tasks.length; index++) {
        const task = tasks[index];
        if (task.status == 'pending') {
          this._statusCounter.set({
            ...this._statusCounter(),
            pending: this._statusCounter()['pending'] + 1,
          });
        } else if (task.status == 'in_progress') {
          this._statusCounter.set({
            ...this._statusCounter(),
            in_progress: this._statusCounter()['in_progress'] + 1,
          });
        } else {
          this._statusCounter.set({
            ...this._statusCounter(),
            done: this._statusCounter()['done'] + 1,
          });
        }
      }
      for (let index = 2; index <= totalPages; index++) {
        this.callingTasksAPIWithPage(index).subscribe((response) => {
          const innerTasks = response['data'].result;
          for (let innerIndex = 0; innerIndex < innerTasks.length; innerIndex++) {
            const innerTask = innerTasks[innerIndex];
            if (innerTask.status == 'pending') {
              this._statusCounter.set({
                ...this._statusCounter(),
                pending: this._statusCounter()['pending'] + 1,
              });
            } else if (innerTask.status == 'in_progress') {
              this._statusCounter.set({
                ...this._statusCounter(),
                in_progress: this._statusCounter()['in_progress'] + 1,
              });
            } else {
              this._statusCounter.set({
                ...this._statusCounter(),
                done: this._statusCounter()['done'] + 1,
              });
            }
          }
        });
      }
    });
  }

  getUserNames(): void  {
    this.http.get(`http://127.0.0.1:3000/api/users?page=1`).subscribe((response) => {
      let totalPages = response['data'].pageCount;
      const users = response['data'].result;
      const userNamesObj = {};
      for (let index = 0; index < users.length; index++) {
        const user = users[index];
        this._userNames.set({ id: user.name });
        userNamesObj[user.id] = user.name;
      }
      for (let index = 2; index <= totalPages; index++) {
        this.callingUsersAPIWithPage(index).subscribe((response) => {
          const innerUsers = response['data'].result;
          for (let innerIndex = 0; innerIndex < innerUsers.length; innerIndex++) {
            const innerUser = innerUsers[innerIndex];

            this.userNames[innerUser.id] = innerUser.name;
          }
        });
      }
      this._userNames.set(userNamesObj);
    });
  }

  getAllTasks(): void {
    this._loading.set(true);
    this.http.get<ResponseGetData<Task>>(this.API_URL).subscribe((response) => {
      this._taskList.set(response['data'].result);
      this._loading.set(false);
    });
  }

  taskListFiltered = computed(() => {
    const items: Task[] = this.taskList();
    return items;
  });

  getTaskById(id: number | undefined): Observable<BaseResponse<Task>> {
    return this.http.get<BaseResponse<Task>>(`${this.API_URL}/${id}`);
  }

  addData(task: Task): void {
    const userId = JSON.parse(localStorage.getItem('user') ?? '[]')[0].id;
    const sendingTask = {
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      assigneeId: userId,
    };
    this.http
      .post(`${this.API_URL}`, sendingTask)
      .subscribe((response) => (response['success'] ? this.getAllTasks() : ''));
  }

  updateTask(task: Task): void {
    this.http
      .put<BaseResponse<Task>>(`${this.API_URL}/${task.id}`, task)
      .subscribe((response) => (response['success'] ? this.getAllTasks() : ''));
  }

  applyFilters(
    currentPage: number = 1,
    pageSize: number = 10,
    title: string = '',
    status: string = '',
    priority: string = '',
    assigneeId: number = 0,
    sortBy = '',
  ): void {
    this._loading.set(true);
    const url = new URL(`${this.API_URL}`);
    if (currentPage) url.searchParams.set('page', currentPage.toString());
    if (pageSize) url.searchParams.set('pageSize', pageSize.toString());
    if (status) url.searchParams.set('status', status);
    if (priority) url.searchParams.set('priority', priority);
    if (title) url.searchParams.set('search', title);
    if (assigneeId) url.searchParams.set('assigneeId', assigneeId.toString());
    if (sortBy) url.searchParams.set('sortBy', sortBy);
    this.http.get(url.toString()).subscribe((response) => {
      (this._loading.set(false),
        this._recordCounter.set(response['data'].rowsCount),
        this._taskList.set(response['data'].result));
    });
  }

  removeData(id: number | undefined): void {
    this.http
      .delete(`${this.API_URL}/${id}`)
      .subscribe((response) => (response['success'] ? this.getAllTasks() : ''));
  }
}
