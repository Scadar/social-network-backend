import {NextFunction, Request, Response} from 'express';
import AuthService from './AuthService';
import {API_URL_FRONT} from '../../../config';
import {AuthResponse, RequestWithUser} from './authInterface';
import {LoginInput} from './payload/LoginInput';
import {SignUpInput} from './payload/SignUpInput';

class AuthController {
  public authService = new AuthService();

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: LoginInput = req.body;
      const loginUserData: AuthResponse = await this.authService.login(userData);

      res.status(200).json(loginUserData);
    } catch (error) {
      next(error);
    }
  };

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: SignUpInput = req.body;
      const signUpUserData = await this.authService.signUp(userData);

      res.status(200).json(signUpUserData);
    } catch (error) {
      next(error);
    }
  };

  public activate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const activationLink: string = req.params.link;
      await this.authService.activate(activationLink);

      return res.redirect(API_URL_FRONT);
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userData = req.user;
      await this.authService.logout(userData);

      res.status(200).json({success: true});
    } catch (error) {
      next(error);
    }
  };

  public refresh = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const {refreshToken} = req.body;
      const userData = await this.authService.refresh(refreshToken);

      res.status(200).json(userData);
    } catch (error) {
      next(error);
    }
  };

}

export default AuthController;
