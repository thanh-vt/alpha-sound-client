import { Pipe, PipeTransform } from '@angular/core';
import { Entity, FavoritesService } from '../../service/favorites.service';
import { EntityType } from '../../constant/entity-type';
import { UserProfile } from '../../model/token-response';

@Pipe({
  name: 'likes'
})
export class LikesPipe implements PipeTransform {
  constructor(private favoritesService: FavoritesService) {}

  transform(value: Entity[], entityType: EntityType, userProfile: UserProfile): Entity[] {
    if (value.length && entityType && userProfile) {
      this.favoritesService.patchLikes(value, entityType);
    }
    return value;
  }
}
