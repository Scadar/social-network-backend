import {IUser} from '../../user/userInterface';
import {Document} from 'mongoose';
import {MongoId} from '../../../interfaces/base';

export interface IToken {
  user: IUser;
  refreshToken: string;
}

export interface ITokenDocument extends IToken, Document {
  _id: MongoId;
}
