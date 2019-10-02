import {Song} from './song';

export interface Playlist {
  isDisabled?: boolean;
  id?: number;
  name?: string;
  songs?: Song[];
}


