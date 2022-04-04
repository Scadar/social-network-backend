import {model, Schema} from 'mongoose';
import {IDiskDocument} from './diskInterface';

const diskSchema: Schema = new Schema({
  diskSpace:{
    type: Number,
    default: 1024**3*10,
  },
  usedSpace: {
    type: Number,
    default: 0
  },
  files: [{
    type: Schema.Types.ObjectId,
    ref: "File"
  }]
}, {
  timestamps: true,
});

const diskModel = model<IDiskDocument>('Disk', diskSchema);

export default diskModel;
