import UserDto from '../../user/UserDto';
import {IChatMessageDocument, IChatMessageDocumentWithSenderDocument} from './chatMessageInterface';

export default class ChatMessageDto {
  public _id: string;
  public chatRoomId: string;
  public message: string;
  public senderDto: UserDto;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(
      id: string,
      chatRoomId: string,
      message: string,
      senderDto: UserDto,
      createdAt: Date,
      updatedAt: Date,
  ) {
    this._id = id;
    this.chatRoomId = chatRoomId;
    this.message = message;
    this.senderDto = senderDto;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public static fromChatMessageDocumentAndUserDto(
      chatMessage: IChatMessageDocumentWithSenderDocument,
  ) {
    return new ChatMessageDto(
        chatMessage._id.toString(),
        chatMessage.chatRoomId.toString(),
        chatMessage.message,
        UserDto.fromUserDocument(chatMessage.senderId),
        chatMessage.createdAt,
        chatMessage.updatedAt
    );
  }

  public static fromArrayChatMessageDocumentAndUserDto(
      chatMessages: IChatMessageDocumentWithSenderDocument[]
  ) {
    return chatMessages.map(v => ChatMessageDto.fromChatMessageDocumentAndUserDto(v));
  }
}
