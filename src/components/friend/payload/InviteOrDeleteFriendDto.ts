import {IsString} from 'class-validator';

export class InviteOrDeleteFriendDto {

  @IsString()
  public targetId: string;
}
