import { Component, effect, inject, input, ViewChild } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { NonNullableFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '../../../pages/home/services/task/task-service';
import { Task } from '../../../core/models/task';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { LabelModule } from 'primeng/label';
import { ButtonDirective } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  imports: [
    Dialog,
    ReactiveFormsModule,
    SelectModule,
    InputTextModule,
    TextareaModule,
    DatePickerModule,
    LabelModule,
    ButtonDirective,
    ToastModule,
  ],
  providers: [MessageService],
  selector: 'app-add-task-dialog',
  styleUrl: './add-task-dialog.css',
  templateUrl: './add-task-dialog.html',
})
export class AddTaskDialog {
  @ViewChild('statusSelect') statusSelect;
  @ViewChild('prioritySelect') prioritySelect;
  visible: boolean = false;
  dialogVisibility = input<boolean>();
  dt = input<Table<Task>>();
  task = input<Task>();
  taskService = inject(TaskService);
  private messageService = inject(MessageService);
  readonly isEditing = this.taskService.isEditing;

  fb = inject(NonNullableFormBuilder);
  taskForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(15)]],
    status: ['in_progress', Validators.required],
    priority: ['low', Validators.required],
    dueDate: ['', Validators.required],
  });

  status = [
    { label: 'Pendiente', value: 'pending' },
    { label: 'En progreso', value: 'in_progress' },
    { label: 'Completada', value: 'done' },
  ];

  priority = [
    { label: 'Baja', value: 'low' },
    { label: 'Media', value: 'medium' },
    { label: 'Alta', value: 'high' },
  ];

  statusSelectedValue;
  prioritySelectedValue;

  constructor() {
    effect(() => {
      const visible = this.dialogVisibility();
      this.visible = visible as boolean;
    });
    effect(() => {
      if (this.isEditing()) {
        this.taskForm.patchValue({
          title: this.task()!.title,
          description: this.task()!.description,
          status: this.task()!.status,
          priority: this.task()!.priority,
          dueDate: this.task()!.dueDate,
        });
        this.statusSelect.value = this.task()!.status;
      }
    });
  }

  deactiveEdition(): void {
    this.taskService.deactivateEdition();
  }

  showSuccess(): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Tarea guardada exitosamente',
      detail: 'Tu tarea ha sido guardada.',
    });
  }

  showUpdate(): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Tarea actualizada exitosamente',
      detail: 'Tu tarea ha sido actualiza.',
    });
  }

  showError(): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Hubo un error',
      detail: 'Confirmar que los datos introducidos esten correctos',
    });
  }

  closeDialog(): void {
    this.visible = false;
  }

  onSubmit() {
    if (!this.taskForm.valid) {
      this.showError();
      return;
    }
    this.showSuccess();

    if (typeof this.statusSelect.value == 'object') {
      this.taskForm.value.status = this.statusSelect.value.value;
    }
    if (typeof this.prioritySelect.value == 'object') {
      this.taskForm.value.priority = this.prioritySelect.value.value;
    }
    const modifiedDate = new Date(this.taskForm.value.dueDate as string)
      .toISOString()
      .split('T')[0];

    this.taskForm.value.dueDate = modifiedDate;
    if (this.isEditing()) {
      const updatedTask: any = { ...this.task(), ...this.taskForm.value };
      this.taskService.updateTask(updatedTask);
      this.taskForm.patchValue({
        title: '',
        description: '',
        status: '',
        priority: '',
        dueDate: '',
      });
      this.showUpdate();
      this.closeDialog();
      this.taskService.applyFilters();
      return;
    }
    this.taskService.addData(this.taskForm.value as Task);

    this.closeDialog();
  }
}
