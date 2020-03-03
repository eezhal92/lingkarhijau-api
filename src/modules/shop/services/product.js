import mongoose from 'mongoose';
import { Product } from '../../../db/models';
import { createSlug } from './helpers';

export function findProducts() {
  return Product.find({ archived: false }).populate('category').exec();
}

export async function findProductByIdOrSlug(identity) {
  let product = await Product.findOne({ slug: identity });

  if (!product) product = await Product.findById(identity);

  return product;
}

/**
 * @param {object} payload
 * @param {string} payload.title
 * @param {number} payload.price
 * @param {string?} payload.category
 * @param {string} payload.description
 * @param {string[]?} payload.images
 * @param {string[]?} payload.categories
 * @param {string[]?} payload.tags
 */
export function createProduct(payload) {
  const { category, ...rest } = payload;
  const data = Object.assign(rest, {
    slug: createSlug(payload.title),
  });

  if (mongoose.Types.ObjectId.isValid(category)) {
    data.category = category;
  }

  return Product.create(data);
}
