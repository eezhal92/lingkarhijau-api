import { model, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { getPickupTypes } from '../../lib/pickup';

/**
 * @typedef PickupTransactionItem
 * @property {string} text
 * @property {string} type
 * @property {string} unit
 * @property {number} price
 * @property {number} qty
 */

/**
 * This models store transactions when picking user's trash
 */

const PickupTransactionSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  type: { type: String, enum: getPickupTypes() }, // donation | deposit | cash
  /** @property {PickupTransactionItem[]} items */
  items: [Schema.Types.Mixed],
  amount: Number,
  meta: Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

PickupTransactionSchema.plugin(mongoosePaginate);

export default model('PickupTransaction', PickupTransactionSchema);
