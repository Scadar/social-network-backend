import {Document} from 'mongoose';
import {MongoId} from '../../interfaces/base';

// NOT_FRIENDS      -     отношение в БД  отсутствует
// FRIEND           -     отношение в БД: (sourceUser -> targetUser === 'accepted') OR (targetUser -> sourceUser === 'accepted')
// REQUEST_SENT     -     отношение в БД: sourceUser -> targetUser === 'pending'
// I_FOLLOWER       -     отношение в БД: sourceUser -> targetUser === 'rejected'
// PENDING_ACTION   -     отношение в БД: targetUser -> sourceUser === 'pending'
// YOUR_FOLLOWER    -     отношение в БД: targetUser -> sourceUser === 'rejected'

export enum UserToUserRelationship {
  NOT_FRIEND = 'NOT_FRIEND',
  FRIEND = 'FRIEND',
  REQUEST_SENT = 'REQUEST_SENT', 
  I_FOLLOWER = 'I_FOLLOWER',
  PENDING_ACTION = 'PENDING_ACTION',
  YOUR_FOLLOWER = 'YOUR_FOLLOWER',
}

export type FriendStatus = 'pending' | 'rejected' | 'accepted';

export interface IFriend {
  sourceId: MongoId;
  targetId: MongoId;
  status: FriendStatus;
}

export interface IFriendDocument extends IFriend, Document {
  _id: MongoId;
}

