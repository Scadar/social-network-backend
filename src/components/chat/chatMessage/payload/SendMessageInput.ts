import {IsString, Max, Min} from 'class-validator';

export class SendMessageInput {
  @IsString()
  public chatRoomId: string;

  @IsString()
  @Min(1)
  @Max(1024)
  public message: string;
}
