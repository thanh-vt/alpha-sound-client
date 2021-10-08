import { Component, Input } from '@angular/core';
import { FavoritesService } from '../../../service/favorites.service';
import { Album } from '../../../model/album';
import { Observable } from 'rxjs';
import { UserProfile } from '../../../model/token-response';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-album-like-btn',
  templateUrl: './album-like-btn.component.html',
  styleUrls: ['./album-like-btn.component.scss']
})
export class AlbumLikeBtnComponent {
  currentUser$: Observable<UserProfile>;
  @Input() album: Album;

  constructor(private favoritesService: FavoritesService, private authService: AuthService) {
    this.currentUser$ = this.authService.currentUser$;
  }

  like(event: MouseEvent, album: Album, isLiked: boolean): void {
    event.stopPropagation();
    this.favoritesService.like(album, isLiked, 'ALBUM');
  }
}
