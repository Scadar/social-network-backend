import {Router} from 'express';
import {Routes} from '../../interfaces/routesInterface';
import authMiddleware from '../../middlewares/authMiddleware';
import FriendController from './FriendController';
import validationMiddleware from '../../middlewares/validationMiddleware';
import {InviteOrDeleteFriendDto} from './payload/InviteOrDeleteFriendDto';

class FriendRoute implements Routes {
  public path = '/friend';
  public router = Router();
  public friendController = new FriendController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
        `${this.path}/invite`,
        authMiddleware,
        validationMiddleware(InviteOrDeleteFriendDto, 'body'),
        this.friendController.inviteFriend
    );
    this.router.delete(
        `${this.path}/delete/:targetId`,
        authMiddleware,
        validationMiddleware(InviteOrDeleteFriendDto, 'params'),
        this.friendController.deleteFriend
    );
  }
}

export default FriendRoute;
