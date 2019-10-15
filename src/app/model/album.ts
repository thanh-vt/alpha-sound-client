import {Artist} from './artist';

export interface Album {
  id: number;
  title: string;
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
