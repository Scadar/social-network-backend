import {Router} from 'express';
import {Routes} from '../../../interfaces/routesInterface';
import AuthController from './AuthController';
import validationMiddleware from '../../../middlewares/validationMiddleware';
import authMiddleware from '../../../middlewares/authMiddleware';
import {LoginInput} from './payload/LoginInput';
import {SignUpInput} from './payload/SignUpInput';
import {ActivateInput} from './payload/ActivateInput';
import {RefreshTokenInput} from './payload/RefreshTokenInput';

class AuthRoute implements Routes {
  public path = '/';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // User registration
    this.router.post(
        `${this.path}register`,
        validationMiddleware(SignUpInput, 'body'),
        this.authController.signUp,
    );
    // User Mail Confirmation
    this.router.get(
        `${this.path}activate/:link`,
        validationMiddleware(ActivateInput, 'params'),
        this.authController.activate,
    );
    // User login
    this.router.post(
        `${this.path}login`,
        validationMiddleware(LoginInput, 'body'),
        this.authController.logIn,
    );
    // User logout
    this.router.post(
        `${this.path}logout`,
        authMiddleware,
        this.authController.logOut,
    );
    //User refresh token
    this.router.post(
        `${this.path}refresh`,
        validationMiddleware(RefreshTokenInput, 'body'),
        this.authController.refresh,
    );
  }
}

export default AuthRoute;
