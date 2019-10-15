import {Artist} from './artist';

export interface Song {
  id: number;
  title: string;
  releaseDate: number;
  url: string;
  rating?: [];
  displayRating?: any;
  artists?: Artist[];
  tags?: [];
  genres?: [];
  mood?: any;
  activity?: any;
  isDisabled?: boolean;
  liked?: boolean;
}
