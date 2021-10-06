import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Song } from '../model/song';
import { PagingInfo } from '../model/paging-info';
import { tap } from 'rxjs/operators';
import { Album } from '../model/album';
import { PlayingQueueService } from '../shared/layout/music-player/playing-queue.service';
import { AuthService } from './auth.service';
import { AudioTrack } from '../shared/layout/music-player/audio-track';
import { FavoritesService } from './favorites.service';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private favoritesService: FavoritesService,
    private playingQueueService: PlayingQueueService
  ) {
    this.playingQueueService.trackEvent.subscribe(next => {
      if (next && next.event === 'play') {
        this.favoritesService.listen(next.track.id, 'SONG').subscribe();
      }
    });
  }

  songList(params?: { page?: number; size?: number; sort?: string[] }): Observable<PagingInfo<Song>> {
    return this.http.get<PagingInfo<Song>>(`${environment.apiUrl}/song/list`, { params, withCredentials: true }).pipe(
      tap(songPage => {
        songPage.content.forEach(song => {
          song.isDisabled = this.playingQueueService.checkAlreadyInQueue(song?.url);
        });
      })
    );
  }

  searchForSong(name: string): Observable<PagingInfo<Song>> {
    return this.http.get<PagingInfo<Song>>(`${environment.apiUrl}/song/es-search`, { params: { name }, withCredentials: true });
  }

  songDetail(id: number): Observable<Song> {
    return this.http.get<Song>(`${environment.apiUrl}/song/detail/${id}`).pipe(
      tap(song => {
        song.isDisabled = this.playingQueueService.checkAlreadyInQueue(song?.url);
      })
    );
  }

  songAdditionalInfo(id: number): Observable<Song> {
    return this.http.get<Song>(`${environment.apiUrl}/song/additional-info/${id}`);
  }

  uploadSong(formData: FormData): Observable<HttpEvent<never>> {
    return this.http.post<never>(`${environment.apiUrl}/song/upload`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  updateSong(formData: FormData, id: number): Observable<HttpEvent<Song>> {
    return this.http.put<Song>(`${environment.apiUrl}/song/edit/${id}`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  getAlbumSongList(albumId: number, page: number, size = 100): Observable<PagingInfo<Song>> {
    return this.http
      .get<PagingInfo<Song>>(`${environment.apiUrl}/song/search`, {
        params: {
          albumId,
          page,
          size
        }
      })
      .pipe(
        tap(songPage => {
          songPage.content.forEach(song => {
            song.isDisabled = this.playingQueueService.checkAlreadyInQueue(song?.url);
          });
        })
      );
  }

  getUploadedSongList(page: number): Observable<PagingInfo<Song>> {
    return this.http
      .get<PagingInfo<Song>>(`${environment.apiUrl}/song/search`, {
        params: {
          page,
          username: this.authService.currentUserValue.user_name
        }
      })
      .pipe(
        tap(songPage => {
          songPage.content.forEach(song => {
            song.isDisabled = this.playingQueueService.checkAlreadyInQueue(song?.url);
          });
        })
      );
  }

  getUserFavoriteSongList(option?: { page?: number; size?: number; sort?: string[] }): Observable<PagingInfo<Song>> {
    const requestUrl = `${environment.apiUrl}/song/search`;
    return this.http
      .get<PagingInfo<Song>>(requestUrl, {
        params: {
          ...option,
          usernameFavorite: this.authService.currentUserValue.user_name
        }
      })
      .pipe(
        tap(songPage => {
          songPage.content.forEach(song => {
            song.isDisabled = this.playingQueueService.checkAlreadyInQueue(song?.url);
          });
        })
      );
  }

  deleteSong(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/song/delete/${id}`);
  }

  play(song: Song): void {
    song.listeningFrequency++;
    this.playingQueueService.addToQueueAndPlay({
      id: song.id,
      title: song.title,
      duration: song.duration,
      url: song.url,
      artist: song.artists?.length ? song.artists.map(e => e.name).join(', ') : ''
    });
  }

  playAlbum(album: Album): void {
    album.listeningFrequency++;
    this.getAlbumSongList(album.id, 0).subscribe(next => {
      const tracks: AudioTrack[] = next.content.map(song => ({
        id: song.id,
        title: song.title,
        duration: song.duration,
        url: song.url,
        artist: song.artists?.length ? song.artists.map(e => e.name).join(', ') : ''
      }));
      this.playingQueueService.addAllToQueueAndPlay(tracks);
    });
  }
}
