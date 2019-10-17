import {Role} from './role';

export interface User {
  isDisabled: boolean;
  id?: number;
  username?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  gender?: boolean;
  birthDate?: number;
  phoneNumber?: number;
  email?: string;
  avatarUrl: string;
  roles?: [Role];
}
