import {Setting} from './setting';
import {UserProfile} from './user-profile';

export interface User {
  id: number;
  username: string;
  password: string;
  enabled: boolean;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
  authorities: string[];
  setting: Setting;
  userProfile: UserProfile;
}
