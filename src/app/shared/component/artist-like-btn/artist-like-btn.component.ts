import { Component, Input } from '@angular/core';
import { Artist } from '../../../model/artist';
import { FavoritesService } from '../../../service/favorites.service';
import { AuthService } from '../../../service/auth.service';
import { Observable } from 'rxjs';
import { UserProfile } from '../../../model/token-response';

@Component({
  selector: 'app-artist-like-btn',
  templateUrl: './artist-like-btn.component.html',
  styleUrls: ['./artist-like-btn.component.scss']
})
export class ArtistLikeBtnComponent {
  currentUser$: Observable<UserProfile>;
  @Input() artist: Artist;

  constructor(private favoritesService: FavoritesService, private authService: AuthService) {
    this.currentUser$ = this.authService.currentUser$;
  }

  like(event: MouseEvent, artist: Artist, isLiked: boolean): void {
    event.stopPropagation();
    this.favoritesService.like(artist, isLiked, 'ARTIST');
  }
}
