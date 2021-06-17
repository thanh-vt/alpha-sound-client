export type TokenResponse = TokenInfo & UserProfile;

export interface TokenInfo {
  access_token: string;
  expires_in: number;
  iat: number;
  refresh_token: string;
  scope: string;
  token_type: string;
}

export interface UserProfile {
  user_name?: string;
  first_name?: string;
  last_name?: string;
  gender?: number;
  roles?: string[];
  authorities?: string[];
  avatar_url?: string;
  date_of_birth?: number;
  password?: string;
  phone_number?: string;
  email?: string;
}
