import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Album } from '../model/album';
import { Observable } from 'rxjs';
import { PagingInfo } from '../model/paging-info';
import { AuthService } from './auth.service';
import { AlbumEntryUpdate } from '../model/album-entry-update';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  albumList(page: number, sort = 'asc'): Observable<PagingInfo<Album>> {
    const requestUrl = `${environment.apiUrl}/album/list`;
    const params: { [key: string]: string } = { page: `${page}`, sort };
    return this.http.get<PagingInfo<Album>>(requestUrl, { params });
  }

  albumDetail(id: number): Observable<Album> {
    const params = { id };
    return this.http.get<Album>(`${environment.apiUrl}/album/detail`, { params });
  }

  albumAdditionalInfo(id: number): Observable<Album> {
    return this.http.get<Album>(`${environment.apiUrl}/album/additional-info/${id}`);
  }

  uploadAlbum(formData: FormData): Observable<Album> {
    return this.http.post<Album>(`${environment.apiUrl}/album/upload`, formData);
  }

  updateAlbum(formData: FormData, id: number): Observable<Album> {
    return this.http.put<Album>(`${environment.apiUrl}/album/edit/${id}`, formData);
  }

  updateSongList(songList: AlbumEntryUpdate[], albumId: number): Observable<void> {
    return this.http.patch<void>(`${environment.apiUrl}/album/update-song-list/${albumId}`, songList);
  }

  getUserAlbumList(page: number): Observable<PagingInfo<Album>> {
    return this.http.get<PagingInfo<Album>>(`${environment.apiUrl}/album/search`, {
      params: {
        page,
        username: this.authService.currentUserValue.user_name
      }
    });
  }
}
