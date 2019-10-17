import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {filter, map, tap} from 'rxjs/operators';
import {Artist} from '../model/artist';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {

  constructor(private http: HttpClient) {
  }

  artistList() {
    return this.http.get<any>(`${environment.apiUrl}/artist/list`);
  }

  artistDetail(id: number) {
    return this.http.get<any>(`${environment.apiUrl}/artist/detail?id=${id}`);
  }

  getSongList(id: number) {
    return this.http.get<any>(`${environment.apiUrl}/artist/song-list?artist-id=${id}`);
  }

  searchArtist(name: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/artist/search?name=${name}`).pipe(
      tap((response: any) => {
        if (response) {
          response
            .map(artist => artist.name);
        }
      })
    );
  }

  uploadArtist(formData): Observable<HttpEvent<any>> {
    return this.http.post<any>(`${environment.apiUrl}/artist/create`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  deleteArtist(id: number) {
    return this.http.delete<any>(`${environment.apiUrl}/artist/delete?id=${id}`);
  }

  getArtistDetail(id: number): Observable<Artist> {
    return this.http.get<Artist>(`${environment.apiUrl}/artist/detail?id=${id}`);
  }

  updateArtist(formGroup, id: number): Observable<HttpEvent<any>> {
    // @ts-ignore
    // @ts-ignore
    return this.http.put<any>(`${environment.apiUrl}/artist/update?id=${id}`, formGroup, {
      reportProgress: true,
      observe: 'events'
    });
  }
}
