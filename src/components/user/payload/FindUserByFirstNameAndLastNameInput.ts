import {IsNumberString, IsString} from 'class-validator';

export class FindUserByFirstNameAndLastNameInput {

  @IsString()
  public firstName: string;

  @IsString()
  public lastName: string;

  @IsNumberString()
  public page: number;

  @IsNumberString()
  public pageSize: number;
}
