import {Router} from 'express';
import {Routes} from '../../interfaces/routesInterface';
import UsersController from './UserController';
import authMiddleware from '../../middlewares/authMiddleware';
import validationMiddleware from '../../middlewares/validationMiddleware';
import {FindUserByFirstNameAndLastNameInput} from './payload/FindUserByFirstNameAndLastNameInput';
import {FindUsersByFriendStatusInput} from './payload/FindUsersByFriendStatusInput';
import {GetUserByIdInput} from './payload/GetUserByIdInput';

class UsersRoute implements Routes {
  public path = '/user';
  public router = Router();
  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
        `${this.path}`,
        authMiddleware,
        this.usersController.getUsers,
    );
    this.router.get(
        `${this.path}/profile`,
        authMiddleware,
        this.usersController.getProfile,
    );
    this.router.patch(
        `${this.path}/updatePhotoProfile`,
        authMiddleware,
        this.usersController.updatePhotoProfile,
    );
    this.router.delete(
        `${this.path}/deletePhotoProfile`,
        authMiddleware,
        this.usersController.deletePhotoProfile,
    );
    this.router.get(
        `${this.path}/findUserByFirstNameAndLastName`,
        authMiddleware,
        validationMiddleware(FindUserByFirstNameAndLastNameInput, 'query'),
        this.usersController.findUserByFirstNameAndLastName,
    );
    this.router.get(
        `${this.path}/findUsersByFriendStatus`,
        authMiddleware,
        validationMiddleware(FindUsersByFriendStatusInput, 'query'),
        this.usersController.findUsersByFriendStatus,
    );
    this.router.get(
        `${this.path}/:userId`,
        authMiddleware,
        validationMiddleware(GetUserByIdInput, 'params'),
        this.usersController.getUserById,
    );
  }
}

export default UsersRoute;
