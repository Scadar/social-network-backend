import {IsString} from 'class-validator';

export class GetUserByIdInput {

  @IsString()
  public userId: string;
}
