import {Artist} from './artist';
import {Comment} from './comment';

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
  comments?: Comment[];
}
