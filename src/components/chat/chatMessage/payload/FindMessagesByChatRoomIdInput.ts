import {IsNumberString, IsString} from 'class-validator';

export class FindMessagesByChatRoomIdInput {

  @IsString()
  public chatRoomId: string;

  @IsNumberString()
  public skip: number;

  @IsNumberString()
  public pageSize: number;
}
