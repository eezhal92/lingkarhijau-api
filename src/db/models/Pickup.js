import { model, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { PickupStatus } from '../../lib/pickup';

const PickupSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  account: {
    type: Schema.Types.ObjectId,
    ref: 'Account'
  },
  assignee: { type: Schema.Types.ObjectId, ref: 'User' },
  address: { type: String, required: true },
  coordinate: { type: String, required: true },
  date: { type: String, required: true },
  note: String,
  type: String,
  createdAt: { type: Date, default: Date.now },
  status: { type: Number, default: PickupStatus.PLACED },
  updatedAt: { type: Date, default: Date.now },
});

PickupSchema.plugin(mongoosePaginate);

export default model('Pickup', PickupSchema);
