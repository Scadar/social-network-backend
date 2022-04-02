import {IsString} from 'class-validator';

export class FindPrivateChatRoomWithCompanionProfileInput {

  @IsString()
  chatRoomId: string;
}
