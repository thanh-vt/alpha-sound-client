import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpEvent} from '@angular/common/http';
import {environment} from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AudioUploadService {
  constructor(private http: HttpClient) { }

  uploadSong(formData: FormData, albumId?: number): Observable<HttpEvent<any>> {
    if (!!albumId) {
      return this.http.post<any>(`${environment.apiUrl}/song/upload?album-id=${albumId}`, formData, {reportProgress: true,
        observe: 'events'
      });
    } else {
      return this.http.post<any>(`${environment.apiUrl}/song/upload`, formData, {reportProgress: true,
        observe: 'events'
      });
    }
  }

  uploadAlbum(formData): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/album/upload`, formData);
  }

}
