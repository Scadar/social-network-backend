import {model, Schema} from 'mongoose';
import {ITokenDocument} from './tokenInterface';

const tokenSchema: Schema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  refreshToken: {
    type: String,
  },
});

const tokenModel = model<ITokenDocument>('Token', tokenSchema);

export default tokenModel;
