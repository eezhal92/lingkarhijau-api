import { model, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { getTransactionTypes } from '../../lib/transaction';

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
const TransactionSchema = Schema({
  account: { type: Schema.Types.ObjectId, ref: 'Account' },

  type: { type: String, required: true, enum: getTransactionTypes() },

  // To indicate whether this transaction related to any pickup
  pickup: { type: Schema.Types.ObjectId, ref: 'Pickup' },

  amount: { type: Number, required: true },

  /** @property {PickupTransactionItem[]} items */
  meta: { type: Schema.Types.Mixed },

  createdAt: { type: Date, default: Date.now },

  updatedAt: { type: Date, default: Date.now },
});

TransactionSchema.plugin(mongoosePaginate);

export default model('Transaction', TransactionSchema);
