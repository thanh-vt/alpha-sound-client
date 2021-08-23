import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserProfile } from '../model/token-response';
import { RegistrationConfirm } from '../model/registration-confirm';
import { ChangePassword } from '../model/change-password';

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

  register(formGroup): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/register`, formGroup);
  }

  confirmRegistration(registrationConfirm: RegistrationConfirm): Observable<void> {
    return this.http.patch<void>(`${environment.apiUrl}/registration-confirm`, registrationConfirm);
  }

  uploadAvatar(formData: FormData): Observable<HttpEvent<any>> {
    return this.http
      .post<any>(`${environment.apiUrl}/upload-avatar`, formData, { reportProgress: true, observe: 'events' })
      .pipe(catchError(this.errorMgmt));
  }

  updateProfile(formGroup): Observable<HttpEvent<any>> {
    return this.http.put<any>(`${environment.apiUrl}/profile`, formGroup);
  }

  getPasswordResetToken(formGroup): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/reset-password`, formGroup);
  }

  resetPasswordSubmission(changePassword: ChangePassword): Observable<void> {
    return this.http.patch<void>(`${environment.apiUrl}/reset-password`, changePassword);
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
