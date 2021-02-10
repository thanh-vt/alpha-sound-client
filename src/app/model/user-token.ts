import {Setting} from './setting';
import {UserProfile} from './user-profile';

export interface UserToken {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  id: number;
  authorities: [string];
  user_name: string;
  profile: UserProfile;
  setting: Setting;
}
