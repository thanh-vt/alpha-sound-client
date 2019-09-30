import {Role} from './role';

export interface UserToken {
  username?: string;
  accessToken?: string;
  tokenType?: string;
  roles: Role[];
}
