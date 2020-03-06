import mongoose from 'mongoose';
import { Product } from '../../../db/models';
import { createSlug } from './helpers';

function createFindQuery(payload) {
  const { search, category } = payload;
  const query = {
    archived: false,
    visible: false,
  };

  if (category && category !== 'all') {
    query.category = payload.category;
  }

  if (search) {
    query.title = { $regex: new RegExp(`${search.toLowerCase()}`), $options: 'ig' };
  }

  return query;
}

/**
 * @param {object} payload
 * @param {string?} payload.category
 * @param {string?} payload.search
 * @param {number?} payload.limit
 * @param {number?} payload.page
 */
export function findProducts(payload) {
  const { page = 1, limit = 16 } = payload;
  const query = createFindQuery(payload);
  console.log({ query });
  return Product.paginate(query, {
    page,
    limit,
    customLabels: {
      docs: 'products',
      totalDocs: 'total'
    },
    populate: [
      { path: 'category' },
    ],
    sort: { createdAt: -1 }
  });
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
 * @param {number} payload.stock
 * @param {string} payload.unit
 * @param {string[]?} payload.images
 * @param {string[]?} payload.categories
 * @param {string[]?} payload.tags
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
