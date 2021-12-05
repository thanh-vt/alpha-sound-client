import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Artist } from '../model/artist';
import { PagingInfo } from '../model/paging-info';
import { tap } from 'rxjs/operators';
import { Song } from '../model/song';
import { PlayingQueueService } from '../shared/layout/music-player/playing-queue.service';
import { SongService } from './song.service';
import { AuthService } from './auth.service';
import { FavoritesService } from './favorites.service';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private playingQueueService: PlayingQueueService,
    private songService: SongService,
    private favoritesService: FavoritesService
  ) {}

  artistList(page = 0, size = 10): Observable<PagingInfo<Artist>> {
    return this.http.get<PagingInfo<Artist>>(`${environment.apiUrl}/artist/list`, {
      params: {
        page,
        size
      }
    });
  }

  searchArtist(params?: { page?: number; size?: number; sort?: string[] } | { [key: string]: string }): Observable<PagingInfo<Artist>> {
    return this.http.get<PagingInfo<Artist>>(`${environment.apiUrl}/artist/search`, {
      params
    });
  }

  searchArtistByName(name: string, page = 0, size = 10): Observable<PagingInfo<Artist>> {
    return this.http.get<PagingInfo<Artist>>(`${environment.apiUrl}/artist/es-search`, {
      params: {
        name,
        page,
        size
      }
    });
  }

  artistDetail(id: number): Observable<Artist> {
    return this.http.get<Artist>(`${environment.apiUrl}/artist/detail/${id}`);
  }

  getAlbumArtistList(albumId: number, page: number, size = 100): Observable<PagingInfo<Artist>> {
    return this.http.get<PagingInfo<Artist>>(`${environment.apiUrl}/artist/search`, {
      params: {
        albumId,
        page,
        size
      }
    });
  }

  getSongListOfArtist(id: number, page: number): Observable<PagingInfo<Song>> {
    const params = {
      artistId: `${id}`,
      page,
      size: 10
    };
    return this.http.get<PagingInfo<Song>>(`${environment.apiUrl}/song/search`, { params }).pipe(
      tap(songPage => {
        this.favoritesService.patchLikes(songPage.content, 'SONG');
        console.log(songPage.content);
        songPage.content.forEach(song => {
          song.isDisabled = this.playingQueueService.checkAlreadyInQueue(song?.url);
        });
      })
    );
  }

  createArtist(formData: FormData): Observable<HttpEvent<Artist>> {
    return this.http.post<Artist>(`${environment.apiUrl}/artist/create`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  updateArtist(formData: FormData, id: number): Observable<HttpEvent<Artist>> {
    return this.http.put<Artist>(`${environment.apiUrl}/artist/edit/${id}`, formData, {
      reportProgress: true,
      observe: 'response'
    });
  }

  deleteArtist(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/artist/delete/${id}`);
  }
}
