import {Singleton} from '../../../utils/Singleton';
import chatRoomModel from './chatRoomModel';
import {ChatRoomType, IChatRoomDocument} from './chatRoomInterface';
import {HttpException} from '../../../exceptions/HttpException';

@Singleton
class ChatRoomService {
  private chatRoomModel = chatRoomModel;

  public async findChatRoomById(chatRoomId: string): Promise<IChatRoomDocument>{
    if (!chatRoomId) {
      throw HttpException.badRequest('chatRoomId must be not null');
    }
    return this.chatRoomModel.findById(chatRoomId);
  }

  public async findUserChatRooms(userId: string): Promise<IChatRoomDocument[]> {
    if (!userId) {
      throw HttpException.badRequest('userId must be not null');
    }

    return this.chatRoomModel.find({
      userIds: {
        $in: userId,
      },
    });
  }

  public async findOrCreatePrivateChatRoom(sourceUserId: string, targetUserId: string): Promise<IChatRoomDocument> {
    let room = await this.findPrivateChatRoom(sourceUserId, targetUserId);
    if (!room) {
      room = await this.createChatRoom(sourceUserId, [sourceUserId, targetUserId]);
    }
    return room;
  }

  public async createChatRoom(initiatorId: string, userIds: string[]): Promise<IChatRoomDocument> {
    return await this.chatRoomModel.create({
      initiator: initiatorId,
      userIds,
      type: ChatRoomType.PRIVATE
    });
  }

  public async findPrivateChatRoom(sourceUserId: string, targetUserId: string): Promise<IChatRoomDocument> {
    if (!sourceUserId || !targetUserId) {
      throw HttpException.badRequest('sourceUserId and targetUserId must be not null');
    }
    return this.chatRoomModel.findOne({
      userIds: {
        $size: 2,
        $all: [sourceUserId, targetUserId],
      },
    });
  }
}

export default ChatRoomService;
