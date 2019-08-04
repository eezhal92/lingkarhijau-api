import { model, Schema } from 'mongoose';
import { getValidTrashTypes } from '../../lib/trash-pricing';

const TrashPricingSchema = Schema({
  type: { type: String, enum: getValidTrashTypes(), required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, default: '' },
  archived: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default model('TrashPricing', TrashPricingSchema);
