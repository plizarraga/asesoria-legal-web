import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { IUser } from '../_shared/models/user.model';

const baseUrl = `${environment.API_URL}/users`;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject: BehaviorSubject<IUser>;
  public user: Observable<IUser>;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    // this.userSubject = new BehaviorSubject<IUser>(null);
    this.userSubject = new BehaviorSubject<IUser>(JSON.parse(localStorage.getItem('user')));
    this.user = this.userSubject.asObservable();

  }

  public get userValue(): IUser {
    return this.userSubject.value;
  }

  signin(email: string, password: string): any {
    // console.log('authService - signin method', email, password);
    return this.http.post<any>(`${baseUrl}/users/auth/signin`, { user: {email, password} }, { withCredentials: true })
      .pipe(map(user => {
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
        // this.startRefreshTokenTimer();
        return user;
      }));
  }

  logout(): void {
    // console.log('authService - logout method');
    // this.http.delete<any>(`${baseUrl}/logout`, {}).subscribe();
    // this.stopRefreshTokenTimer();
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/auth/signin']);
  }
}
