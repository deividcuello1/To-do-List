import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { loginGuard } from './core/guards/login-guard';
import { TaskById } from './pages/task-by-id/task-by-id';
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tareas',
    pathMatch: 'full',
  },
  {
    path: 'tareas',
    canActivate: [loginGuard],
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'tareas/:id',
    canActivate: [loginGuard],
    loadComponent: () => import('./pages/task-by-id/task-by-id').then((m) => m.TaskById),
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];
