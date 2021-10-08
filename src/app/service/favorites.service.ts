import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { finalize } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { EntityType } from '../constant/entity-type';
import { Observable } from 'rxjs';
import { Song } from '../model/song';
import { Album } from '../model/album';
import { Artist } from '../model/artist';

export type Entity = Song | Album | Artist;

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  listen(id: number, type: EntityType): Observable<void> {
    const listen = {
      id,
      type
    };
    return this.http.patch<void>(`${environment.apiUrl}/favorites/listen`, listen);
  }

  like(entity: Entity, isLiked: boolean, type: EntityType): void {
    const params = {
      id: entity.id,
      isLiked,
      type
    };
    entity.loadingLikeButton = true;
    this.http
      .patch<void>(`${environment.apiUrl}/favorites/like`, params)
      .pipe(
        finalize(() => {
          entity.loadingLikeButton = false;
        })
      )
      .subscribe(() => {
        entity.liked = isLiked;
      });
  }

  patchLikes(entities: Entity[], type: EntityType): void {
    if (!this.authService.currentUserValue) {
      return;
    }
    const params = {
      type
    };
    const userSongLikeMap = {};
    entities.forEach(e => {
      userSongLikeMap[e.id] = e.liked ?? false;
    });
    this.http
      .patch<{ id: number; isLiked: boolean }>(`${environment.apiUrl}/favorites/like-map`, userSongLikeMap, { params })
      .subscribe(next => {
        entities.forEach(song => {
          song.liked = next[song.id];
        });
      });
  }
}
