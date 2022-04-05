import {Document} from 'mongoose';
import {MongoId} from '../../../interfaces/base';

export interface IFile {
  name: string;
  type: string;
  accessLink?: string;
  size: number;
  parentPath: string;
  fullPath: string;
  userId: MongoId;
  parentId: MongoId;
  childrenIds: MongoId[];
}

export interface IFileDocument extends IFile, Document {
  _id: MongoId;
}

