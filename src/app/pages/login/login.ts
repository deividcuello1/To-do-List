import { Component, inject, OnInit, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../core/auth/services/user-service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  imports: [FormsModule, ProgressSpinnerModule, ToastModule],
  providers: [MessageService],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  usernameInputValue = '';
  passwordInputValue = '';
  userService = inject(UserService);
  router = inject(Router);
  readonly loading = this.userService.loading;
  readonly isLoggedTracker = this.userService.isLoggedTracker;
  private messageService = inject(MessageService);

  constructor(){
    effect(() => {
      if(!this.isLoggedTracker()){
        this.showError();
      }
    })
  }
  checkCredentials() {
    if (this.usernameInputValue && this.passwordInputValue) {
      this.userService.login(this.usernameInputValue, this.passwordInputValue);
    } else {
      alert('Confirme que haya introducido todos los datos');
    }
  }

  onSubmit() {
    this.checkCredentials();
  }

  showSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'Credenciales correctas',
      detail: 'Has introducido las credenciales correctas.',
    });
  }

  showError() {
    this.messageService.add({
      severity: 'error',
      summary: 'Sus credenciales no son correctas',
      detail: 'Confirme sus credenciales y introduzcala nuevamente',
    });
  }

  ngOnInit() {
    if (this.userService.isLogged()) {
      this.router.navigate(['/tareas']);
    }
  }
}
