import { Song } from './song';
import { ResourceInfo } from './resource-info';
import { Entity } from '../service/favorites.service';

export interface Artist extends Entity {
  isDisabled?: boolean;
  id: number;
  name?: string;
  birthDate?: number;
  avatarUrl?: string;
  avatarResource?: ResourceInfo;
  biography?: string;
  songs?: Song[];
  loadingLikeButton?: boolean;
  liked?: boolean;
}
