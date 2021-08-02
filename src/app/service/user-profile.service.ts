import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserProfile } from '../model/token-response';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  constructor(private http: HttpClient) {}

  getCurrentUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${environment.apiUrl}/profile`);
  }

  getUserDetail(username: string): Observable<UserProfile> {
    const params = { username };
    return this.http.get<UserProfile>(`${environment.authUrl}/api/user`, { params });
  }

  register(formGroup): Observable<HttpEvent<any>> {
    return this.http.post<any>(`${environment.apiUrl}/register`, formGroup);
  }

  uploadAvatar(formData: FormData): Observable<HttpEvent<any>> {
    return this.http
      .post<any>(`${environment.apiUrl}/upload-avatar`, formData, { reportProgress: true, observe: 'events' })
      .pipe(catchError(this.errorMgmt));
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
