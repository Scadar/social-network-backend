import {Request} from 'express';
import UserDto from '../../user/UserDto';

export interface DataStoredInToken {
  _id: string;
  email: string;
  isActivated: boolean;
}

export interface RefreshTokenData {
  refreshToken: string;
  refreshExpiresIn: number;
}

export interface AccessTokenData {
  accessToken: string;
  accessExpiresIn: number;
}

export interface TokenData extends RefreshTokenData, AccessTokenData {
}

export interface RequestWithUser extends Request {
  user: DataStoredInToken;
}

export interface AuthResponse extends TokenData {
  user: UserDto;
}

export interface RefreshResponse extends AccessTokenData {
  user: UserDto;
}
