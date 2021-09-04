import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Song } from '../model/song';
import { PagingInfo } from '../model/paging-info';
import { finalize, tap } from 'rxjs/operators';
import { Album } from '../model/album';
import { PlayingQueueService } from '../shared/layout/music-player/playing-queue.service';
import { AuthService } from './auth.service';
import { AudioTrack } from '../shared/layout/music-player/audio-track';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  constructor(private http: HttpClient, private authService: AuthService, private playingQueueService: PlayingQueueService) {
    this.playingQueueService.trackEvent.subscribe(next => {
      if (next && next.event === 'play') {
        this.listenToSong(next.track.id).subscribe();
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

  songDetail(id: number): Observable<Song> {
    return this.http.get<Song>(`${environment.apiUrl}/song/detail/${id}`).pipe(
      tap(song => {
        song.isDisabled = this.playingQueueService.checkAlreadyInQueue(song?.url);
      })
    );
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

  listenToSong(songId: number): Observable<Song> {
    return this.http.patch<Song>(`${environment.apiUrl}/song/listen`, songId);
  }

  likeSong(song: Song, isLiked: boolean): void {
    const params = {
      songId: song.id,
      isLiked
    };
    song.loadingLikeButton = true;
    this.http
      .patch<void>(`${environment.apiUrl}/song/like`, params)
      .pipe(
        finalize(() => {
          song.loadingLikeButton = false;
        })
      )
      .subscribe(() => {
        song.liked = isLiked;
      });
  }

  patchLikes(songs: Song[]): void {
    const userSongLikeMap = {};
    songs.forEach(e => {
      userSongLikeMap[e.id] = e.liked;
    });
    this.http.patch<{ id: number; isLiked: boolean }>(`${environment.apiUrl}/song/like-map`, userSongLikeMap).subscribe(next => {
      songs.forEach(song => {
        song.liked = next[song.id];
      });
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

  commentSong(songId: number, comment: Comment): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/song?comment&song-id=${songId}`, comment);
  }

  deleteComment(commentId: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/song?comment&comment-id=${commentId}`);
  }

  play(song: Song): void {
    song.listeningFrequency++;
    this.playingQueueService.addToQueueAndPlay({
      id: song.id,
      title: song.title,
      duration: song.duration,
      url: song.url
    });
  }

  playAlbum(album: Album): void {
    album.listeningFrequency++;
    this.getAlbumSongList(album.id, 0).subscribe(next => {
      const tracks: AudioTrack[] = next.content.map(song => ({
        id: song.id,
        title: song.title,
        duration: song.duration,
        url: song.url
      }));
      this.playingQueueService.addAllToQueueAndPlay(tracks);
    });
  }
}
