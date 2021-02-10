import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {User} from '../model/user';
import {HttpClient, HttpErrorResponse, HttpEvent} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/profile`);
  }

  getUserDetail(userId: number): Observable<User> {
    return this.http.get<User>(`${environment.authUrl}/api/user/${userId}`);
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

  getPasswordResetToken(formGroup): Observable<HttpEvent<any>> {
    return this.http.post<any>(`${environment.apiUrl}/reset-password`, formGroup);
  }

  resetPasswordSubmission(formGroup, id: number, token: string): Observable<HttpEvent<any>> {
    return this.http.put<any>(`${environment.apiUrl}/reset-password?id=${id}&token=${token}`, formGroup);
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
