import { UserInfo } from './user-info';
import { CommentType } from '../constant/comment-type';

export interface Comment {
  isDisabled?: boolean;
  id?: number;
  content?: string;
  localDateTime?: Date;
  userInfo?: UserInfo;
  entityId: number;
  commentType: CommentType;
  isEditing?: boolean;
}
