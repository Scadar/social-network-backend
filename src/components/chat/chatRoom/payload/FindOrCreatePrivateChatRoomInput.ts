import {IsString} from 'class-validator';

export class FindOrCreatePrivateChatRoomInput {

  @IsString()
  public targetUserId: string;
}
