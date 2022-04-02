import {model, Schema} from 'mongoose';
import {IUserDocument} from './userInterface';

const userSchema: Schema = new Schema({
  phone: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  isActivated: {
    type: Boolean,
    default: false,
  },
  activationLink: {
    type: String,
  },
  pictureURL: {
    type: String,
    default: 'emptyUser.png'
  },
  statusDescription: {
    type: String,
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true,
  },
}, {
  timestamps: true,
});

const userModel = model<IUserDocument>('User', userSchema);

export default userModel;
