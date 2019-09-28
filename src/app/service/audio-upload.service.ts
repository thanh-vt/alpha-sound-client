import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AudioUploadService {
  constructor(private http: HttpClient) { }

  uploadSong(formData): Observable<HttpEvent<any>> {
    return this.http.post<any>(`${environment.apiUrl}/song/upload`, formData);
  }
}
