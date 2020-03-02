import { model, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const ProductCategorySchema = Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

ProductCategorySchema.plugin(mongoosePaginate);

export default model('ProductCategory', ProductCategorySchema);
