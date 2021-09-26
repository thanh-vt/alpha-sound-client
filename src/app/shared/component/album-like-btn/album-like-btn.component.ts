import { Component, Input } from '@angular/core';
import { FavoritesService } from '../../../service/favorites.service';
import { Album } from '../../../model/album';

@Component({
  selector: 'app-album-like-btn',
  templateUrl: './album-like-btn.component.html',
  styleUrls: ['./album-like-btn.component.scss']
})
export class AlbumLikeBtnComponent {
  @Input() album: Album;

  constructor(private favoritesService: FavoritesService) {}

  like(event: MouseEvent, album: Album, isLiked: boolean): void {
    event.stopPropagation();
    this.favoritesService.like(album, isLiked, 'ALBUM');
  }
}
