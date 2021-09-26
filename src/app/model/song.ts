import { Artist } from './artist';
import { Comment } from './comment';
import { Genre } from './genre';
import { Tag } from './tag';
import { Theme } from './theme';
import { Country } from './country';
import { UserProfile } from './token-response';
import { ResourceInfo } from './resource-info';
import { Setting } from './setting';
import { Entity } from '../service/favorites.service';

export interface Song extends Entity {
  rn: number;
  id: number;
  title: string;
  releaseDate: number;
  url?: string;
  audioResource?: ResourceInfo;
  rating?: [];
  displayRating?: any;
  artists?: Artist[];
  tags?: Tag[];
  genres?: Genre[];
  theme?: Theme;
  country?: Country;
  isDisabled?: boolean;
  liked?: boolean;
  uploader?: {
    username: string;
    profile: UserProfile;
    setting: Setting;
  };
  comments?: Comment[];
  listeningFrequency?: number;
  loadingLikeButton?: boolean;
  duration: number;
  lyric: string;
}
