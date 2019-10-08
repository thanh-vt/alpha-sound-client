import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Song} from '../model/song';
import {Observable} from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SongService {

  constructor(private http: HttpClient) {
  }

  getSongList() {
    return this.http.get<any>(`${environment.apiUrl}/song/list`);
  }

  updateSong(song: Song, id: number): Observable<Song> {
    return this.http.put<Song>(`${environment.apiUrl}/song/edit?id=${id}`, song);
  }

  addSongToPlaylist(songId: number, playlistId: number) {
    return this.http.post(`${environment.apiUrl}/song/add-to-playlist?songId=${songId}&playlistId=${playlistId}`, '');
  }
  getdetailSong(id: number) {
    return this.http.get<any>(`${environment.apiUrl}/song/detail?id=${id}`);
  }
  deleteSongPlaylist(id: number): Observable<HttpEvent<any>> {
    return this.http.delete<any>(`${environment.apiUrl}/song/delete?id=${id}`);
  }
  getNewSong() {
    return this.http.get<any>(`${environment.apiUrl}/song/sortByDate`);
  }
}
