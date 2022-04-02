import {IsEmail, IsString} from 'class-validator';

export class LoginInput {

  @IsEmail()
  public email: string;


  @IsString()
  public password: string;
}
