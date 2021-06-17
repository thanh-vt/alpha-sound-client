import {UserProfile} from './token-response';
import {Setting} from './setting';

export interface UserInfo {
  username: number;
  profile?: UserProfile;
  setting?: Setting;
}
