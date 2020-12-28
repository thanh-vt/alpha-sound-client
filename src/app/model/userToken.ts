import {Role} from './role';
import {Setting} from './setting';

export interface UserToken {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  id: number;
  roles: [Role];
  username: string;
  avatarUrl: string;
  setting: Setting;
}
