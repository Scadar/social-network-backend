import {Router} from 'express';
import {Routes} from '../../../interfaces/routesInterface';
import authMiddleware from '../../../middlewares/authMiddleware';
import ChatMessageController from './ChatMessageController';
import validationMiddleware from '../../../middlewares/validationMiddleware';
import {SendMessageInput} from './payload/SendMessageInput';
import {FindMessagesByChatRoomIdInput} from './payload/FindMessagesByChatRoomIdInput';

class ChatMessageRoute implements Routes {
  public path = '/message';
  public router = Router();
  public chatMessageController = new ChatMessageController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
        `${this.path}`,
        authMiddleware,
        validationMiddleware(SendMessageInput, 'body'),
        this.chatMessageController.createMessage,
    );
    this.router.get(
        `${this.path}`,
        authMiddleware,
        validationMiddleware(FindMessagesByChatRoomIdInput, 'query'),
        this.chatMessageController.findMessagesByChatRoomId,
    );
  }
}

export default ChatMessageRoute;
