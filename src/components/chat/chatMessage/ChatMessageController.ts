import {RequestWithUser} from '../../auth/auth/authInterface';
import {NextFunction, Response} from 'express';
import ChatUserService from '../chatUser/ChatUserService';
import ChatMessageService from './ChatMessageService';
import {SendMessageInput} from './payload/SendMessageInput';
import {FindMessagesByChatRoomIdInput} from './payload/FindMessagesByChatRoomIdInput';

class ChatMessageController {

  public chatMessageService = new ChatMessageService();
  public chatUserService = new ChatUserService();

  public createMessage = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const input: SendMessageInput = req.body;
      const userId = req.user._id;

      const createdMessage = await this.chatMessageService.createMessageWithUserInfo(
          userId,
          input.chatRoomId,
          input.message
      );

      res.status(201).json(createdMessage);
    } catch (e) {
      next(e);
    }
  };

  public findMessagesByChatRoomId = async (req: RequestWithUser, res: Response, next: NextFunction) => {

    try {
      const input: FindMessagesByChatRoomIdInput = req.query as unknown as FindMessagesByChatRoomIdInput;
      const userId = req.user._id;

      const messages = await this.chatUserService.findMessagesByChatRoomIdAndUserId(
          input.chatRoomId,
          userId,
          input.skip,
          input.pageSize,
      );

      res.status(200).json(messages);
    } catch (e) {
      next(e);
    }
  };
}

export default ChatMessageController;
