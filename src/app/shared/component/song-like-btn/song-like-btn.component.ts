import { Component, Input } from '@angular/core';
import { Song } from '../../../model/song';
import { AuthService } from '../../../service/auth.service';
import { Observable } from 'rxjs';
import { UserProfile } from '../../../model/token-response';
import { FavoritesService } from '../../../service/favorites.service';

@Component({
  selector: 'app-song-like-btn',
  templateUrl: './song-like-btn.component.html',
  styleUrls: ['./song-like-btn.component.scss']
})
export class SongLikeBtnComponent {
  currentUser$: Observable<UserProfile>;
  @Input() song: Song;

  constructor(private authService: AuthService, private favoritesService: FavoritesService) {
    this.currentUser$ = this.authService.currentUser$;
  }

  likeSong(song: Song, event: Event, isLiked: boolean): void {
    event.stopPropagation();
    this.favoritesService.like(song, isLiked, 'SONG');
  }
}
