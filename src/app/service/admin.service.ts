import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private http: HttpClient) { }

  getUserList() {
    return this.http.get<any>(`${environment.apiUrl}/admin/user-list`);
  }

  deleteUser(id: number) {
    return this.http.delete<any>(`${environment.apiUrl}/user/delete-user?id=${id}`);
  }
}
