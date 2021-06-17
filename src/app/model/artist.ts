import {Song} from './song';
import {ResourceInfo} from './resource-info';

export interface Artist {
  isDisabled?: boolean;
  id?: number;
  name?: string;
  birthDate?: number;
  avatarUrl?: string;
  avatarResource?: ResourceInfo;
  biography?: string;
  songs?: Song[];
}
