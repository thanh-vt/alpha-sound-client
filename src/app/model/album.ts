import {Artist} from './artist';
import {Genre} from './genre';
import {Theme} from './theme';
import {Tag} from './tag';
import {Song} from './song';
import {Country} from './country';

export interface Album {
  id: number;
  title: string;
  releaseDate: Date;
  coverUrl: string;
  genres: Genre[];
  songs: Song[];
  artists: Artist[];
  tags: Tag[];
  country: Country;
  theme: Theme;
  isDisabled?: boolean;
}
