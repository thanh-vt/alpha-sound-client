import {Role} from './role';

export interface UserToken {
  id?: number;
  username?: string;
  accessToken?: string;
  tokenType?: string;
  roles: Role[];
}
