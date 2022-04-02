import {Document} from 'mongoose';
import {ITimestamp, MongoId} from '../../../interfaces/base';
import {IUserDocument} from '../../user/userInterface';

export interface IChatMessage extends ITimestamp {
  senderId: MongoId;
  chatRoomId: MongoId;
  message: string;
}

export interface IChatMessageDocument extends IChatMessage, Document {
  _id: MongoId;
}

export type IChatMessageDocumentWithSenderDocument = IChatMessageDocument & {
  senderId: IUserDocument
}
