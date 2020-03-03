import slugify from 'slugify';
import { Product } from '../../../db/models';

function createSlug(text) {
  return slugify(text, {
    lower: true,
    strict: true,
  });
}

export function findProducts() {
  return Product.find({ archived: false });
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
 * @param {string} payload.description
 * @param {string[]?} payload.images
 * @param {string[]?} payload.categories
 * @param {string[]?} payload.tags
 */
export function createProduct(payload) {
  return Product.create(Object.assign(payload, {
    slug: createSlug(payload.title),
  }));
}
