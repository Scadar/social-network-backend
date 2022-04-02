import {IsString} from 'class-validator';

export class FindUsersByFriendStatusInput {

  @IsString()
  public status: string;
}
