import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Playlist } from '../model/playlist';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagingInfo } from '../model/paging-info';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  constructor(private http: HttpClient) {}

  getPlaylistList(): Observable<PagingInfo<Playlist>> {
    return this.http.get<PagingInfo<Playlist>>(`${environment.apiUrl}/playlist/list`);
  }

  getPlaylistListToAdd(songId: number): Observable<PagingInfo<Playlist>> {
    return this.http.get<PagingInfo<Playlist>>(`${environment.apiUrl}/playlist/list-to-add?song-id=${songId}`);
  }

  createPlaylist(formGroup: Playlist): Observable<Playlist> {
    return this.http.post<Playlist>(`${environment.apiUrl}/playlist/create`, formGroup);
  }

  editPlaylist(formGroup: Playlist, playlistId: number): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/playlist/edit/${playlistId}`, formGroup);
  }

  deletePlaylist(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/playlist/delete/${id}`);
  }

  getPlayListDetail(id: number): Observable<Playlist> {
    return this.http.get<Playlist>(`${environment.apiUrl}/playlist/detail/${id}`);
  }

  addSongToPlaylist(playlistId: number, songIds: number[]): Observable<void> {
    return this.http.patch<void>(`${environment.apiUrl}/playlist/add-song/${playlistId}`, songIds);
  }

  deleteSongFromPlaylist(playlistId: number, songIds: number[]): Observable<void> {
    return this.http.patch<void>(`${environment.apiUrl}/playlist/remove-song/${playlistId}`, songIds);
  }
}
