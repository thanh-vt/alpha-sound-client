import {Role} from './role';

export interface UserToken {
  userId?: number;
  accessToken?: string;
  tokenType?: string;
}
