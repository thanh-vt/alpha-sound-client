export interface ChangePassword {
  username?: string;
  token?: string;
  oldPassword?: string;
  mewPassword: string;
  repeatedNewPassword: string;
}
