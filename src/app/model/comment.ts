import {User} from './user';

export interface Comment {
  isDisabled?: boolean;
  id?: number;
  content?: string;
  user?: User;
}
