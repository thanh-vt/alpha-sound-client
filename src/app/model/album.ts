import {Artist} from './artist';

export interface Album {
  id: number;
  name: string;
  releaseDate: Date;
  coverUrl: string;
  genres: [];
  songs: [];
  artists: Artist[];
  tags: [];
  country: any;
  theme: any;
  isDisabled?: boolean;
}
