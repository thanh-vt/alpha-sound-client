import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {User} from '../models/user';
import {HttpClient, HttpErrorResponse, HttpEvent} from '@angular/common/http';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
  public currentUser = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.update.subscribe(
      (action) => {
        if (action[0] === 'login') {
          this.setProfile(action[1], action[2]);
        } else {
          if (localStorage.getItem('user')) {
            localStorage.removeItem('user');
          }
          if (sessionStorage.getItem('user')) {
            sessionStorage.removeItem('user');
          }
          this.currentUserSubject.next(null);
        }
      }
    );
  }

  setProfile(userId: number, rememberMe: boolean) {
    this.http.get<User>(`${environment.apiUrl}/profile/${userId}`).subscribe(
      user => {
        if (rememberMe) {
          localStorage.setItem('user', JSON.stringify(user));
        } else {
          sessionStorage.setItem('user', JSON.stringify(user));
        }
        this.currentUserSubject.next(user);
      });
  }

  getProfile(userId: number): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/profile/${userId}`);
  }

  register(formGroup): Observable<HttpEvent<any>> {
    return this.http.post<any>(`${environment.apiUrl}/register`, formGroup);
  }

  uploadAvatar(formData: FormData): Observable<HttpEvent<any>> {
    return this.http.post<any>(`${environment.apiUrl}/upload-avatar`, formData, {reportProgress: true, observe: 'events'}).pipe(
      catchError(this.errorMgmt)
    );
  }

  updateProfile(formGroup): Observable<HttpEvent<any>> {
    return this.http.put<any>(`${environment.apiUrl}/profile`, formGroup);
  }

  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
