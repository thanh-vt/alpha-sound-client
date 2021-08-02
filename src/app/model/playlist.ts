import { Song } from './song';

export interface Playlist {
  isDisabled?: boolean;
  id?: number;
  title?: string;
  songs?: Song[];
}
