import {Document} from 'mongoose';
import UserDto from './UserDto';
import {UserToUserRelationship} from '../friend/friendInterface';
import {MongoId} from '../../interfaces/base';

export interface IUser {
  phone?: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isActivated: boolean;
  activationLink?: string;
  pictureURL?: string;
  statusDescription?: string;
  gender: 'male' | 'female';
}

export interface IUserDtoWithRelationship extends UserDto {
  friendStatus: UserToUserRelationship;
}

export interface IUserDocument extends IUser, Document {
  _id: MongoId;
}

