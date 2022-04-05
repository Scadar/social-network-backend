import {model, Schema} from 'mongoose';
import {IFileDocument} from './fileInterface';

const fileSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  accessLink: {
    type: String,
  },
  size: {
    type: Number,
    default: 0,
  },
  fullPath: {
    type: String,
    required: true,
  },
  parentPath: {
    type: String,
    default: '',
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  parentId: {
    type: Schema.Types.ObjectId,
    ref: 'File',
  },
  childrenIds: [
    {
      type: Schema.Types.ObjectId,
      ref: 'File',
    }],
}, {
  timestamps: true,
});
//TODO create index (unique name+path)
const fileModel = model<IFileDocument>('File', fileSchema);

export default fileModel;
