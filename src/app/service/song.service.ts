import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
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
}
