import { UserInfo } from './user-info';

export interface Comment {
  isDisabled?: boolean;
  id?: number;
  content?: string;
  localDateTime?: Date;
  userInfo?: UserInfo;
}
