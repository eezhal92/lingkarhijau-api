import { model, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const ProductSchema = Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, index: true },
  price: { type: Number, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'ProductCategory' },
  tags: [{ type: Schema.Types.ObjectId, ref: 'ProductTag' }],
  description: { type: String, required: true },
  images: { type: Array, required: true },
  stock: { type: Number, default: 0 },
  unit: { type: String, required: true, enum: ['pcs', 'gram', 'kg', 'pack'] },
  visible: { type: Boolean, default: false },
  archived: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

ProductSchema.plugin(mongoosePaginate);

export default model('Product', ProductSchema);
