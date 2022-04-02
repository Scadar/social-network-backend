import {Document} from 'mongoose';
import {ITimestamp, MongoId} from '../../../interfaces/base';

export enum ChatRoomType {
  PRIVATE = 'PRIVATE',
  GROUP = 'GROUP',
}

export interface IChatRoom extends ITimestamp {
  userIds: MongoId[];
  name?: string;
  initiator: MongoId;
  pictureURL?: string;
  type: ChatRoomType;
}

export interface IChatRoomDocument extends IChatRoom, Document {
  _id: MongoId;
}
