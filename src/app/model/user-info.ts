import { UserProfile } from './token-response';
import { Setting } from './setting';

export interface UserInfo {
  username: string;
  profile?: UserProfile;
  setting?: Setting;
}
