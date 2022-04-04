import {ChatRoomType, IChatRoomDocument} from './chatRoomInterface';
import UserDto from '../../user/UserDto';

export default class ChatRoomDto {
  public _id: string;
  public userIds: string[];
  public name?: string;
  public initiator: string;
  public pictureURL?: string;
  public type: ChatRoomType;
  public user?: UserDto;
  constructor(
      id: string,
      userIds: string[],
      name: string,
      initiator: string,
      pictureURL: string,
      type: ChatRoomType,
  ) {
    this._id = id;
    this.userIds = userIds;
    this.name = name;
    this.initiator = initiator;
    this.pictureURL = pictureURL;
    this.type = type;
  }

  public static fromChatRoomDocument(room: IChatRoomDocument) {
    return new ChatRoomDto(
        room._id.toString(),
        room.userIds.map(v => v.toString()),
        room.name,
        room.initiator.toString(),
        room.pictureURL,
        room.type,
    );
  }

  public static fromArrayChatRoomDocument(rooms: IChatRoomDocument[]) {
    return rooms.map(v => ChatRoomDto.fromChatRoomDocument(v));
  }

  public setUserDto(user: UserDto) {
    this.user = user;
  }

}
