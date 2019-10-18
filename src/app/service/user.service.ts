import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {User} from '../model/user';
import {HttpClient, HttpErrorResponse, HttpEvent} from '@angular/common/http';
import {BehaviorSubject, Observable, Subscription, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
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
        if (action === 'login') {
          this.getProfile();
        } else {
          localStorage.removeItem('user');
          this.currentUserSubject.next(null);
        }
      }
    );
  }

  getProfile() {
    this.http.get<User>(`${environment.apiUrl}/profile`).subscribe(
      user => {
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSubject.next(user);
      });
  }

  register(formGroup): Observable<HttpEvent<any>> {
    return this.http.post<any>(`${environment.apiUrl}/register`, formGroup);
  }

  uploadAvatar(formData): Observable<HttpEvent<any>> {
    return this.http.post<any>(`${environment.apiUrl}/avatar`, formData, {reportProgress: true, observe: 'events'}).pipe(
      catchError(this.errorMgmt)
    );
  }

  updateProfile(formGroup, id: number): Observable<HttpEvent<Blob>> {
    return this.http.put<any>(`${environment.apiUrl}/profile`, formGroup, {
      reportProgress: true,
      observe: 'body'
    });
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
