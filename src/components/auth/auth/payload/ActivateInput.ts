import {IsString} from 'class-validator';

export class ActivateInput {
  @IsString()
  public link: string;
}
