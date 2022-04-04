import ChatRoomService from './ChatRoomService';
import {NextFunction, Response} from 'express';
import {RequestWithUser} from 'components/auth/auth/authInterface';
import ChatUserService from '../chatUser/ChatUserService';

class ChatRoomController {
  private chatRoomService = new ChatRoomService();
  private chatRoomUserService = new ChatUserService();

  public findOrCreatePrivateChatRoom = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const {targetUserId} = req.body;
      const room = await this.chatRoomService.findOrCreatePrivateChatRoom(req.user._id, targetUserId);
      res.status(201).json(room.toObject());
    } catch (error) {
      next(error);
    }
  };

  public findUserChatRooms = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const rooms = await this.chatRoomUserService.findUserChatRoomsWithLastMessage(req.user._id);
      res.status(200).json(rooms);
    } catch (error) {
      next(error);
    }
  };

  public findPrivateChatRoomWithCompanionProfile = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const {chatRoomId} = req.params;
      const room = await this.chatRoomUserService
          .findPrivateChatRoomWithCompanionProfile(
              req.user._id,
              chatRoomId as string,
          );
      res.status(200).json(room);
    } catch (error) {
      next(error);
    }
  };
}

export default ChatRoomController;
