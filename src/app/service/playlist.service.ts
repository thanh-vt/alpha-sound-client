import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Playlist} from '../model/playlist';
import {HttpClient, HttpEvent} from '@angular/common/http';
import {Observable} from 'rxjs';
import {FormGroup} from '@angular/forms';


@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  constructor(private http: HttpClient) {
  }

  createPlaylist(formGroup): Observable<HttpEvent<any>> {
    return this.http.post<any>(`${environment.apiUrl}/playlist/create`, formGroup);
  }


  getPlaylistList() {
    return this.http.get<any>(`${environment.apiUrl}/playlist/list`);
  }

  getPlaylistListToAdd(songId) {
    return this.http.get<any>(`${environment.apiUrl}/playlist/list-to-add?song-id=${songId}`);
  }

  deletePlaylist(id: number): Observable<HttpEvent<any>> {
    return this.http.delete<any>(`${environment.apiUrl}/playlist/delete?id=${id}`);
  }

  getPlayListDetail(id: number): Observable<Playlist> {
    return this.http.get<Playlist>(`${environment.apiUrl}/playlist/detail?id=${id}`);
  }

  addSongToPlaylist(songId: number, playlistId): Observable<void> {
    return this.http.post<any>(`${environment.apiUrl}/playlist/add-song?song-id=${songId}&playlist-id=${playlistId}`, {});
  }

  // deleteSongFromPlaylist()
}
