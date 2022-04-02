import FriendService from './FriendService';
import {NextFunction, Response} from 'express';
import {RequestWithUser} from 'components/auth/auth/authInterface';

export default class FriendController {
  public friendService = new FriendService();

  public inviteFriend = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {

      await this.friendService.inviteFriend(req.user._id, req.body.targetId);

      res.status(200).send();
    } catch (error) {
      next(error);
    }
  };

  public deleteFriend = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      await this.friendService.deleteFriend(req.user._id, req.params.targetId);

      res.status(200).send();
    } catch (error) {
      next(error);
    }
  };
}
