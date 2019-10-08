import { Injectable } from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse, HttpEvent, HttpRequest} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AudioUploadService {
  constructor(private http: HttpClient) { }

  uploadSong(formData): Observable<HttpEvent<any>> {
    return this.http.post<any>(`${environment.apiUrl}/song/upload`, formData, {reportProgress: true,
      observe: 'events'
    });
  }

  uploadAlbum(formData): Observable<HttpEvent<any>> {
    return this.http.post<any>(`${environment.apiUrl}/album/upload`, formData, {reportProgress: true,
      observe: 'events'
    });
  }

}
