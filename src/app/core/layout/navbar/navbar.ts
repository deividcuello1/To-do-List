import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { UserService } from '../../auth/services/user-service';
import { SignOut } from '@primeicons/angular/sign-out';
import { SignIn } from '@primeicons/angular/sign-in';

@Component({
  imports: [RouterLink, RouterModule, SignOut, SignIn],
  selector: 'app-navbar',
  styleUrl: './navbar.css',
  templateUrl: './navbar.html',
})
export class Navbar {
  userService = inject(UserService);
  isLogged = this.userService.isLogged;
  userEmail = signal<string>(JSON.parse(localStorage.getItem('user') ?? '[]')[0]?.email)

  logout(){
    this.userEmail.set('')
    this.userService.logout();
  }
}
