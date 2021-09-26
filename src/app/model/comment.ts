import { UserInfo } from './user-info';
import { EntityType } from '../constant/entity-type';

export interface Comment {
  isDisabled?: boolean;
  id?: number;
  content?: string;
  createTime?: Date;
  updateTime?: Date;
  userInfo?: UserInfo;
  entityId: number;
  entityType: EntityType;
  isEditing?: boolean;
}
