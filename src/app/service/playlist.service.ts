import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {Playlist} from '../model/playlist';
import {HttpClient, HttpEvent} from '@angular/common/http';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  constructor(private http: HttpClient) { }

  createPlaylist(formGroup): Observable<HttpEvent<any>> {
    return this.http.post<any>(`${environment.apiUrl}/playlist/create`, formGroup);
  }

}
