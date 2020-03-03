import mongoose from 'mongoose';
import { Cart } from '../../../db/models';

/**
 * @param {object} payload
 * @param {string} payload.user
 * @param {object} payload.item
 * @param {string} payload.item.productId
 * @param {number} payload.item.qty
 */
export async function createCart(payload) {
  const { user, item } = payload;
  let userId = null;
  if (mongoose.Types.ObjectId.isValid(user)) {
    userId = payload.user;
  }
  return Cart.create({
    user: userId,
    items: [{
      product: item.productId,
      qty: item.qty,
    }],
  });
}

/**
 * @param {object} payload
 * @param {string?} payload.userId
 * @param {string?} payload.cartId
 */
export function findCart(payload) {
  const { userId, cartId } = payload;

  if (cartId && mongoose.Types.ObjectId.isValid(cartId)) {
    return Cart.findById(cartId)
      .populate('items.product');
  };

  if (!userId) return Promise.resolve(null);

  return Cart.findOne({ user: userId })
    .populate('items.product');
}
