import {Artist} from './artist';
import {Genre} from './genre';
import {Theme} from './theme';
import {Tag} from './tag';
import {Song} from './song';
import {Country} from './country';
import {ResourceInfo} from './resource-info';

export interface Album {
  id: number;
  title: string;
  releaseDate: Date;
  coverUrl?: string;
  coverResource?: ResourceInfo;
  genres: Genre[];
  songs: Song[];
  artists: Artist[];
  tags: Tag[];
  country: Country;
  theme: Theme;
  isDisabled?: boolean;
}
