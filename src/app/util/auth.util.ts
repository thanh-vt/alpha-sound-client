import { UserProfile } from '../model/token-response';
import { CommonConstant } from '../constant/common.constant';

export class AuthUtil {
  public static isAdmin(user: UserProfile): boolean {
    if (user?.roles && Array.isArray(user.roles)) {
      return user.roles.some(role => CommonConstant.ROLE_ADMIN.localeCompare(role));
    }
    return false;
  }
}
