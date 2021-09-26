import { Pipe, PipeTransform } from '@angular/core';
import { Entity, FavoritesService } from '../../service/favorites.service';

@Pipe({
  name: 'likes'
})
export class LikesPipe implements PipeTransform {
  constructor(private favoritesService: FavoritesService) {}

  transform(value: Entity[], ...args: any[]): any[] {
    if (args[0] && args[1]) {
      this.favoritesService.patchLikes(value, args[1]);
    }
    return value;
  }
}
