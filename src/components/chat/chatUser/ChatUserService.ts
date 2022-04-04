import {Singleton} from '../../../utils/Singleton';
import ChatRoomService from '../chatRoom/ChatRoomService';
import {ChatRoomType, IChatRoomDocument} from '../chatRoom/chatRoomInterface';
import ChatRoomDto from '../chatRoom/ChatRoomDto';
import UserDto from '../../user/UserDto';
import UserService from '../../user/UserSerivce';
import {MongoId} from '../../../interfaces/base';
import {HttpException} from '../../../exceptions/HttpException';
import ChatMessageService from '../chatMessage/ChatMessageService';
import ChatMessageDto from '../chatMessage/ChatMessageDto';
import {IChatMessageDocument} from '../chatMessage/chatMessageInterface';

@Singleton
class ChatUserService {
  public userService = new UserService();
  public chatRoomService = new ChatRoomService();
  public chatMessageService = new ChatMessageService();

  public async findUserChatRoomsWithLastMessage(userId: string) {
    const result: {room: ChatRoomDto, lastMessage?: IChatMessageDocument}[] = [];
    const rooms = await this.chatRoomService.findUserChatRooms(userId);

    const userRoomMap = new Map<string, IChatRoomDocument>();

    rooms.forEach(room => {
      if (room.type === ChatRoomType.PRIVATE) {
        userRoomMap.set(
            this.getPartnerUserIdIntoPrivateChatRoom(room.userIds, userId),
            room,
        );
      }
    });

    const users = await this.userService.findUsersByIds(Array.from(userRoomMap.keys()));
    const usersDto = UserDto.fromArrayUserDocuments(users);

    usersDto.forEach(user => {
      const room = userRoomMap.get(user._id);
      const chatRoomDto = ChatRoomDto.fromChatRoomDocument(room);
      chatRoomDto.setUserDto(user);
      result.push({room: chatRoomDto});
    });

    for(let i = 0; i < result.length; i++){
      result[i].lastMessage = await this.findLastMessageByRoomId(result[i].room._id.toString());
    }
    return result;
  }

  public async findOrCreatePrivateChatRoom(sourceUserId: string, targetUserId: string) {
    const room = await this.chatRoomService.findOrCreatePrivateChatRoom(sourceUserId, targetUserId);
    const lastMessage = await this.findLastMessageByRoomId(room._id.toString());
    return {room, lastMessage};
  }

  public async findLastMessageByRoomId(roomId: string): Promise<IChatMessageDocument> {
    return await this.chatMessageService.findLastMessageByRoomId(roomId);
  }

  public async findMessagesByChatRoomIdAndUserId(
      chatRoomId: string,
      userId: string,
      skip: number,
      pageSize: number,
  ) {
    const chatRoom = await this.chatRoomService.findChatRoomById(chatRoomId);

    this.chatAccessCheck(
        userId,
        chatRoom.userIds.map(v => v.toString()),
    );

    let messages = await this.chatMessageService.findMessagesWithUserInfoByChatRoomId(chatRoomId, skip, pageSize);

    return ChatMessageDto.fromArrayChatMessageDocumentAndUserDto(messages);
  }

  public async findPrivateChatRoomWithCompanionProfile(
      userId: string,
      chatRoomId: string,
  ): Promise<ChatRoomDto> {
    const room = await this.chatRoomService.findChatRoomById(chatRoomId);

    if (!room) {
      throw HttpException.conflict(`Chat room with id ${chatRoomId} not found`);
    }
    if (room.type !== ChatRoomType.PRIVATE) {
      throw HttpException.conflict(`Chat room not private`);
    }
    const partnerId = this.getPartnerUserIdIntoPrivateChatRoom(room.userIds, userId);
    const partner = await this.userService.findUserById(partnerId);
    const partnerDto = UserDto.fromUserDocument(partner);

    const result = ChatRoomDto.fromChatRoomDocument(room);
    result.setUserDto(partnerDto);

    return result;
  }

  public async findUserChatRoomsWithUserInfo(userId: string): Promise<ChatRoomDto[]> {
    const rooms = await this.chatRoomService.findUserChatRooms(userId);

    const userRoomMap = new Map<string, IChatRoomDocument>();

    rooms.forEach(room => {
      if (room.type === ChatRoomType.PRIVATE) {
        userRoomMap.set(
            this.getPartnerUserIdIntoPrivateChatRoom(room.userIds, userId),
            room,
        );
      }
    });

    const users = await this.userService.findUsersByIds(Array.from(userRoomMap.keys()));
    const usersDto = UserDto.fromArrayUserDocuments(users);

    const result: ChatRoomDto[] = [];
    usersDto.forEach(user => {
      const room = userRoomMap.get(user._id);
      const chatRoomDto = ChatRoomDto.fromChatRoomDocument(room);
      chatRoomDto.setUserDto(user);
      result.push(chatRoomDto);
    });

    return result;
  }

  private chatAccessCheck(userId: string, chatRoomUserIds: string[]) {
    if (!chatRoomUserIds.includes(userId)) {
      throw HttpException.forbidden('Access is denied');
    }
  }

  private getPartnerUserIdIntoPrivateChatRoom(userIds: MongoId[], userId: string) {
    if (userIds.length !== 2) {
      throw HttpException.conflict('Not private chat room');
    }
    if (userIds[0].toString() === userId) {
      return userIds[1].toString();
    }
    if (userIds[1].toString() === userId) {
      return userIds[0].toString();
    }
    throw HttpException.forbidden(`User ${userId} does not enter the room`);
  }
}

export default ChatUserService;
