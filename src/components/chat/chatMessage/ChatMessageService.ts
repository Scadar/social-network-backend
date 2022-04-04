import chatMessageModel from './chatMessageModel';
import {HttpException} from '../../../exceptions/HttpException';
import {IChatMessageDocument, IChatMessageDocumentWithSenderDocument} from './chatMessageInterface';
import {Singleton} from '../../../utils/Singleton';
import ChatMessageDto from './ChatMessageDto';

@Singleton
class ChatMessageService {

  public chatMessageModel = chatMessageModel;

  public async createMessage(
      senderId: string,
      chatRoomId: string,
      message: string,
  ): Promise<IChatMessageDocument> {
    if (!senderId || !chatRoomId || !message) {
      throw HttpException.badRequest(
          'senderId, chatRoomId and message is required',
      );
    }
    return await this.chatMessageModel.create({senderId, chatRoomId, message});
  }

  public async findLastMessageByRoomId(roomId: string): Promise<IChatMessageDocument> {
    return this.chatMessageModel
        .findOne({
          chatRoomId: roomId,
        })
        .sort({createdAt: -1});
  }

  public async createMessageWithUserInfo(
      senderId: string,
      chatRoomId: string,
      message: string,
  ): Promise<ChatMessageDto> {
    if (!senderId || !chatRoomId || !message) {
      throw HttpException.badRequest(
          'senderId, chatRoomId and message is required',
      );
    }
    const newMessage = await this.chatMessageModel.create({senderId, chatRoomId, message});
    const newMessageWithUser = await newMessage.populate({
      path: 'senderId',
      model: 'User',
    }) as unknown as IChatMessageDocumentWithSenderDocument;

    return ChatMessageDto.fromChatMessageDocumentAndUserDto(newMessageWithUser);
  }

  public async findMessagesByChatRoomId(
      chatRoomId: string,
  ): Promise<IChatMessageDocument[]> {
    if (!chatRoomId) {
      throw HttpException.badRequest(
          'chatRoomId is required',
      );
    }

    return this.chatMessageModel.find({chatRoomId});
  }

  public async findMessagesWithUserInfoByChatRoomId(
      chatRoomId: string,
      skip: number,
      pageSize: number,
  ): Promise<IChatMessageDocumentWithSenderDocument[]> {
    if (!chatRoomId) {
      throw HttpException.badRequest(
          'chatRoomId is required',
      );
    }

    return this.chatMessageModel
        .find({chatRoomId})
        .populate({
          path: 'senderId',
          model: 'User',
        })
        .sort({createdAt: -1})
        .limit(pageSize)
        .skip(skip) as unknown as IChatMessageDocumentWithSenderDocument[];
  }
}

export default ChatMessageService;
