import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {User} from '../model/user';
import {HttpClient, HttpErrorResponse, HttpEvent} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {UserToken} from '../model/userToken';
import {FormGroup} from '@angular/forms';
import {Token} from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {
  }
  getUserList() {
    return this.http.get<any>(`${environment.apiUrl}/list`);
  }
  getProfile(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/profile`);
  }

  createUser(formGroup): Observable<HttpEvent<any>> {
    return this.http.post<any>(`${environment.apiUrl}/register`, formGroup);
  }

  uploadUserAvatar(formData): Observable<HttpEvent<any>> {
    return this.http.post<any>(`${environment.apiUrl}/avatar`, formData, {reportProgress: true, observe: 'events'}).pipe(
      catchError(this.errorMgmt)
    );
  }

  updateUser(formGroup: FormGroup, id: number): Observable<HttpEvent<any>> {
    return this.http.put<any>(`${environment.apiUrl}/profile?id=${id}`, formGroup);
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
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
