import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {User} from '../model/user';
import {HttpClient, HttpEvent} from '@angular/common/http';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }

  getProfile() {
    return this.http.get<User>(`${environment.apiUrl}/profile`);
  }
}
