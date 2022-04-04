import {Document} from 'mongoose';
import {MongoId} from '../../../interfaces/base';

export interface IDisk {
  diskSpace: number;
  usedSpace: number,
  files: MongoId[]
}

export interface IDiskDocument extends IDisk, Document {
  _id: MongoId;
}

