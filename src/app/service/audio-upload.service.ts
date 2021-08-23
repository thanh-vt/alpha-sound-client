import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Album } from '../model/album';

@Injectable({
  providedIn: 'root'
})
export class AudioUploadService {
  constructor(private http: HttpClient) {}

  uploadSong(formData: FormData, album?: Album): Observable<HttpEvent<never>> {
    if (album) {
      const params: { [key: string]: string } = { ['album-id']: `${album.id}` };
      return this.http.post<never>(`${environment.apiUrl}/song/upload`, formData, {
        reportProgress: true,
        observe: 'events',
        params
      });
    } else {
      return this.http.post<never>(`${environment.apiUrl}/song/upload`, formData, {
        reportProgress: true,
        observe: 'events'
      });
    }
  }

  uploadAlbum(formData: FormData): Observable<Album> {
    return this.http.post<Album>(`${environment.apiUrl}/album/upload`, formData);
  }
}
