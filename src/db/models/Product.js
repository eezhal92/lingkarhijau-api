import { model, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const ProductSchema = Schema({
  title: { type: String, required: true },
  categories: [{ type: Schema.Types.ObjectId, ref: 'ProductCategory' }],
  tags: [{ type: Schema.Types.ObjectId, ref: 'ProductTag' }],
  description: { type: String, required: true },
  images: { type: Array, required: true },
  visible: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

ProductSchema.plugin(mongoosePaginate);

export default model('Product', ProductSchema);
