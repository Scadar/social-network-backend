import {Schema} from 'mongoose';

export type MongoId = Schema.Types.ObjectId;

export interface ITimestamp {
  createdAt: Date;
  updatedAt: Date;
}

export type Maybe<T> = T | null | undefined;
