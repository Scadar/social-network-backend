import {model, Schema} from 'mongoose';
import {IFriendDocument} from './friendInterface';

const friendModel: Schema = new Schema({
  sourceId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  targetId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  status: {
    type: String,
    enum: ['pending', 'rejected', 'accepted'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

friendModel.index({sourceId: 1, targetId: 1}, {unique: true});

const friendSchema = model<IFriendDocument>('Friend', friendModel);

export default friendSchema;
