import {IsString} from 'class-validator';

export class RefreshTokenInput {

  @IsString()
  public refreshToken: string;
}
