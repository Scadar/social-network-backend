import {Router} from 'express';
import ChatRoomController from './ChatRoomController';
import {Routes} from '../../../interfaces/routesInterface';
import authMiddleware from '../../../middlewares/authMiddleware';
import {FindOrCreatePrivateChatRoomInput} from './payload/FindOrCreatePrivateChatRoomInput';
import validationMiddleware from '../../../middlewares/validationMiddleware';
import {FindPrivateChatRoomWithCompanionProfileInput} from './payload/FindPrivateChatRoomWithCompanionProfileInput';

class ChatRoomRoute implements Routes {
  public path = '/room';
  public router = Router();
  public chatRoomController = new ChatRoomController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
        `${this.path}`,
        authMiddleware,
        validationMiddleware(FindOrCreatePrivateChatRoomInput, 'body'),
        this.chatRoomController.findOrCreatePrivateChatRoom,
    );
    this.router.get(
        `${this.path}`,
        authMiddleware,
        this.chatRoomController.findUserChatRooms,
    );
    this.router.get(
        `${this.path}/chatRoom/:chatRoomId`,
        authMiddleware,
        validationMiddleware(FindPrivateChatRoomWithCompanionProfileInput, 'params'),
        this.chatRoomController.findPrivateChatRoomWithCompanionProfile,
    );
  }
}

export default ChatRoomRoute;
