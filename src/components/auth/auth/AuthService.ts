import {AuthResponse, DataStoredInToken, RefreshResponse} from './authInterface';
import {HttpException} from '../../../exceptions/HttpException';
import {isEmpty} from '../../../utils/util';
import {Singleton} from '../../../utils/Singleton';
import UserService from '../../user/UserSerivce';
import UserDto from '../../user/UserDto';
import TokenService from '../token/TokenService';
import MailService from '../../mail/MailService';
import {API_URL_BACK} from '../../../config';
import {compare} from 'bcrypt';
import {SignUpInput} from './payload/SignUpInput';
import {LoginInput} from './payload/LoginInput';

@Singleton
class AuthService {
  public userService = new UserService();
  public tokenService = new TokenService();
  public mailService = new MailService();

  public async signUp(userData: SignUpInput): Promise<AuthResponse> {
    if (isEmpty(userData)) {
      throw HttpException.badRequest('userData is missing');
    }

    const user = await this.userService.createUser(userData);
    const userDto = UserDto.fromUserDocument(user);
    const tokens = this.tokenService.generateAccessAndRefreshTokens(userDto);
    await this.tokenService.updateOrCreateRefreshTokenByUserId(user._id.toString(), tokens.refreshToken);

    const activationLink = `${API_URL_BACK}/activate/${user.activationLink}`;
    await this.mailService.sendActivationMail(userData.email, activationLink);

    return {
      user: userDto,
      ...tokens,
    };
  }

  public async activate(activationLink: string) {
    if (!activationLink) {
      throw HttpException.badRequest('Parameter \"link\" is missing');
    }

    await this.userService.activateUserByActivationLink(activationLink);
  }

  public async logout(userData: DataStoredInToken) {
    if (isEmpty(userData)) {
      throw HttpException.badRequest('userData is missing');
    }

    const foundUser = await this.userService.findUserById(userData._id);
    await this.tokenService.removeTokenByUserId(foundUser._id.toString());
  }

  public async login(userData: LoginInput): Promise<AuthResponse> {
    if (isEmpty(userData)) {
      throw HttpException.badRequest('userData is missing');
    }

    const foundUser = await this.userService.findUserByEmail(userData.email);

    const isPasswordMatching: boolean = await compare(userData.password, foundUser.password);
    if (!isPasswordMatching) {
      throw HttpException.conflict('Password not matching');
    }

    const user = UserDto.fromUserDocument(foundUser);

    const tokens = this.tokenService.generateAccessAndRefreshTokens(user);
    await this.tokenService.updateOrCreateRefreshTokenByUserId(foundUser._id.toString(), tokens.refreshToken);

    return {
      ...tokens,
      user,
    };
  }

  public async refresh(refreshToken: string): Promise<RefreshResponse> {
    if (!refreshToken) {
      throw HttpException.badRequest('Body parameter \"refreshToken\" is missing');
    }

    const userData = this.tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await this.tokenService.findTokenByUserId(userData._id);

    if (!userData || !tokenFromDb) {
      throw HttpException.unauthorized();
    }

    const foundUser = await this.userService.findUserById(userData._id);
    const user = UserDto.fromUserDocument(foundUser);
    const accessToken = this.tokenService.generateAccessToken(user);

    return {
      user,
      ...accessToken,
    };
  }
}

export default AuthService;
