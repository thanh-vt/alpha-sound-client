import { Component, Input } from '@angular/core';
import { Artist } from '../../../model/artist';
import { FavoritesService } from '../../../service/favorites.service';

@Component({
  selector: 'app-artist-like-btn',
  templateUrl: './artist-like-btn.component.html',
  styleUrls: ['./artist-like-btn.component.scss']
})
export class ArtistLikeBtnComponent {
  @Input() artist: Artist;

  constructor(private favoritesService: FavoritesService) {}

  like(event: MouseEvent, artist: Artist, isLiked: boolean): void {
    event.stopPropagation();
    this.favoritesService.like(artist, isLiked, 'ARTIST');
  }
}
