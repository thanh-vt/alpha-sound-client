import {Song} from './song';

export interface Artist {
  isDisabled?: boolean;
  id?: number;
  name?: string;
  birthDate?: number;
  avatarUrl?: string;
  biography?: string;
  songs?: Song[];
}
