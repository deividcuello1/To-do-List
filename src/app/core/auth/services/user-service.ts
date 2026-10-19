import { Service, Injectable, inject, signal, DOCUMENT, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { User } from '../../models/user';
import { ResponseGetData } from '../../../shared/models/responseGetData';
import { BaseResponse } from '../../../shared/models/baseResponse';

@Injectable({ providedIn: 'root' })
export class UserService {
  _isLogged = signal<boolean>(false);
  readonly isLogged = this._isLogged.asReadonly();
  router = inject(Router);
  http = inject(HttpClient);

  private _loading = signal<boolean>(true);
  readonly loading = this._loading.asReadonly();

  private _isLoggedTracker = signal<boolean>(false);
  readonly isLoggedTracker = this._isLoggedTracker.asReadonly();

  private API_URL = `${environment.API_URL}api/users`;
  constructor(@Inject(DOCUMENT) private document: Document) {}

  loggedIsTrue() {
    this._isLogged.update((value: boolean) => true);
  }

  login(email: string, password: string) {
    this._loading.set(true);
    this.http.get<ResponseGetData<User>>(this.API_URL).subscribe((response) => {
      const user = response['data'].result.find((obj: any) => obj.email == email);
      if (user && password == 'adminadmin') {
        this._isLoggedTracker.set(false);
        this._loading.set(false);
        localStorage.setItem('user', JSON.stringify([user]));
        this.document.location.href = location.origin;
      } else {
        this._isLoggedTracker.set(false);
        this._isLoggedTracker.set(true);
        this._isLoggedTracker.set(false);
      }
    });
  }

  // getUserById(id: number) {
  //   return this.http.get<BaseResponse<User>>(`${this.API_URL}/${id}`);
  // }

  logout() {
    if (this.isLogged()) {
      this._loading.set(true);
      this._isLoggedTracker.set(false);
      localStorage.removeItem('user');
      this._loading.set(false);
      this._isLogged.update((value: boolean) => false);
      this.router.navigate(['/login']);
      this.document.location.href = location.origin + '/login';
    }
  }
}
