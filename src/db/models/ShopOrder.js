import { model, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const ShopOrderSchema = Schema({
  items: [{
    product: Object,
    qty: Number,
  }],
  customer: {
    user: { type: Schema.Types.ObjectId, ref: 'user' },
    name: { type: String, required: true },
    email: String,
    phone: { type: String, required: true },
  },
  shipment: {
    date: { type: Date, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    zipCode: String,
    status:  {
      type: String,
      enum: ['pending', 'processing', 'canceled', 'completed'],
      default: 'pending'
    },
    courier: {
      name: String,
      vendor: String,
      cost: Number,
    },
    coordinate: String,
  },
  payment: {
    status: {
      type: String,
      enum: ['pending', 'paid', 'canceled', 'refund'],
      default: 'pending',
    },
    confirmationDeadline: { type: Date, default: null },
    method: { type: String, required: true, enum: ['gopay', 'transfer'] },
    total: Number,
  },
  cancellation: {
    note: String,
    actor: { type: Schema.Types.ObjectId, ref: 'user' },
  },
  channel: { type: String, enum: ['online', 'offline'], default: 'online' },
  /**
   * handler yang menerima pesanan secara offline
   */
  handler: { type: Schema.Types.ObjectId, ref: 'user' },
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

ShopOrderSchema.plugin(mongoosePaginate);

export default model('ShopOrder', ShopOrderSchema);
