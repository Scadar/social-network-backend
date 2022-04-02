import jwt, {sign} from 'jsonwebtoken';
import {Singleton} from '../../../utils/Singleton';
import {AccessTokenData, DataStoredInToken, RefreshTokenData, TokenData} from '../auth/authInterface';
import {JWT_ACCESS_SECRET_KEY, JWT_REFRESH_SECRET_KEY} from '../../../config';
import tokenModel from './tokenModel';
import {ITokenDocument} from './tokenInterface';
import UserDto from '../../user/UserDto';
import {HttpException} from '../../../exceptions/HttpException';

@Singleton
class TokenService {

  public tokenModel = tokenModel;

  public async findTokenByUserId(userId: string): Promise<ITokenDocument> {
    const token = this.tokenModel.findOne({user: userId});
    if (!token) {
      throw HttpException.notFound('Refresh token not found');
    }
    return token;
  }

  public async updateOrCreateRefreshTokenByUserId(userId: string, refreshToken: string): Promise<ITokenDocument> {
    const tokenData = await this.tokenModel.findOne({user: userId});
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return await tokenData.save();
    }
    return await this.tokenModel.create({user: userId, refreshToken});
  }

  public async removeTokenByUserId(userId: string) {
    await this.tokenModel.deleteOne({user: userId});
  }

  public validateRefreshToken(refreshToken: string): DataStoredInToken {
    try {
      return jwt.verify(refreshToken, JWT_REFRESH_SECRET_KEY) as DataStoredInToken;
    } catch (e) {
      throw HttpException.unauthorized('Refresh token is invalid');
    }
  }

  public generateRefreshToken(user: UserDto): RefreshTokenData {
    const refreshSecretKey: string = JWT_REFRESH_SECRET_KEY;
    const refreshExpiresIn: number = 60 * 60 * 24 * 30; // 30 days

    const token = TokenService.generateToken(user, refreshSecretKey, refreshExpiresIn);

    return {refreshToken: token, refreshExpiresIn};
  }

  public generateAccessToken(user: UserDto): AccessTokenData {
    const accessSecretKey: string = JWT_ACCESS_SECRET_KEY;
    const accessExpiresIn: number = 60 * 15; // 15 min

    const token = TokenService.generateToken(user, accessSecretKey, accessExpiresIn);

    return {accessToken: token, accessExpiresIn};
  }

  public generateAccessAndRefreshTokens(user: UserDto): TokenData {
    return {
      ...this.generateAccessToken(user),
      ...this.generateRefreshToken(user),
    };
  }

  private static generateToken(user: UserDto, privateKey: string, expiresIn: number) {

    const dataStoredInToken: DataStoredInToken = {
      _id: user._id,
      email: user.email,
      isActivated: user.isActivated,
    };

    return sign(
        dataStoredInToken,
        privateKey,
        {expiresIn: expiresIn},
    );
  }
}

export default TokenService;

