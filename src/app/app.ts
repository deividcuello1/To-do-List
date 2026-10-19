import { Component, signal, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './core/layout/navbar/navbar';
import { UserService } from './core/auth/services/user-service';

@Component({
  imports: [RouterOutlet, Navbar],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('test');
  userService = inject(UserService)
  ngOnInit(){
    if(JSON.parse(localStorage.getItem('user') ?? '[]').length == 1){
      this.userService.loggedIsTrue();
    }
  }
}
