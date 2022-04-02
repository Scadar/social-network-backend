import {IsEmail, IsString, MaxLength, MinLength} from 'class-validator';

export class CreateUserInput {
  @IsEmail()
  public email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  public password: string;
}
