import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';

import { environments } from 'src/environments/environments';
import { IUser } from '../interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = environments.baseUrl;
  private user?: IUser;

  constructor(private http: HttpClient) {}

  get currentUser(): IUser | undefined {
    if (!this.user) return undefined;

    return structuredClone(this.user);
  }

  login(email: string, password: string): Observable<IUser> {
    // http.post('login', {email,password})
    return this.http.get<IUser>(`${this.baseUrl}/users/1`).pipe(
      tap((user) => (this.user = user)),
      tap((user) => localStorage.setItem('token', `TOKEN.TEST.123`))
    );
  }

  logout() {
    this.user = undefined;

    localStorage.removeItem('token');
  }

  checkAuthentication(): Observable<boolean> {
    if (!localStorage.getItem('token')) return of(false);
    const token = localStorage.getItem('token');

    return this.http.get<IUser>(`${this.baseUrl}/users/1`).pipe(
      tap((user) => (this.user = user)), //asignar la respuesta
      map((user) => !!user), // transformar la respuesta
      catchError((error) => of(false))
    );
  }
}
