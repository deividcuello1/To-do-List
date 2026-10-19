import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../auth/services/user-service';
import { inject } from '@angular/core';

export const loginGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const isLogged = userService.isLogged;
  const router = inject(Router);

  if (isLogged()) return true;

  router.navigate(['/login']);
  return false;
};
