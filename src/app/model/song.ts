import {Artist} from './artist';
import {Comment} from './comment';
import {User} from './user';
import {Genre} from './genre';
import {Tag} from './tag';
import {Theme} from './theme';
import {Country} from './country';

export interface Song {
  id: number;
  title: string;
  releaseDate: number;
  url: string;
  rating?: [];
  displayRating?: any;
  artists?: Artist[];
  tags?: Tag[];
  genres?: Genre[];
  theme?: Theme;
  country?: Country;
  isDisabled?: boolean;
  liked?: boolean;
  uploader?: User;
  comments?: Comment[];
  listeningFrequency?: number;
  loadingLikeButton?: boolean;
  duration: number;
}
