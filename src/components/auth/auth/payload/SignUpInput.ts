import {IsEmail, IsEnum, IsString, MaxLength, MinLength} from 'class-validator';

export class SignUpInput {
  @IsEmail()
  public email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  public password: string;

  @IsString()
  @MinLength(2)
  @MaxLength(40)
  public firstName: string;

  @IsString()
  @MinLength(4)
  @MaxLength(40)
  public lastName: string;

  @IsEnum(['male', 'female'])
  public gender: 'male' | 'female';
}
