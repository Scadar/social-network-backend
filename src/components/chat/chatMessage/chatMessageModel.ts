import * as mongoose from 'mongoose';
import {model, Schema} from 'mongoose';
import {IChatMessageDocument} from './chatMessageInterface';

const chatMessageSchema = new mongoose.Schema(
    {
      senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      chatRoomId: {
        type: Schema.Types.ObjectId,
        ref: 'ChatRoom',
      },
      message: {
        type: String,
        min: 1,
        max: 1024,
      }
    },
    {
      timestamps: true,
    },
);

chatMessageSchema.index({chatRoomId: 1})

const chatMessageModel = model<IChatMessageDocument>('ChatMessage', chatMessageSchema);

export default chatMessageModel;
