import * as mongoose from 'mongoose';
import {model, Schema} from 'mongoose';
import {IChatRoomDocument} from './chatRoomInterface';

const chatRoomSchema = new mongoose.Schema(
    {
      userIds: [
        {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
      ],
      name: {
        type: String,
      },
      type: {
        type: String,
        enum: ['PRIVATE', 'GROUP'],
        required: true,
      },
      initiator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      pictureURL: {
        type: String,
      },
    },
    {
      timestamps: true,
    },
);

const chatRoomModel = model<IChatRoomDocument>('ChatRoom', chatRoomSchema);

export default chatRoomModel;
