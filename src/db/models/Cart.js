import { model, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const CartSchema = Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    qty: Number,
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

CartSchema.plugin(mongoosePaginate);

export default model('Cart', CartSchema);
