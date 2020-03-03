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

/**
 * @param {object} payload
 * @param {string} payload.cartId
 * @param {string} payload.productId
 * @param {number} payload.qty
 */
export async function updateItemQty(payload) {
  const { cartId, productId, qty } = payload;
  const cart = await Cart.findById(cartId);

  if (!cart) throw new Error('Not found');
  const isRemove = Number(qty) === 0;

  if (isRemove) {
    return Cart.updateOne({ _id: cartId }, {
      $pull: { product: productId },
    });
  }

  return Cart.updateOne({ _id: cartId, 'items.product': productId }, {
    $set: { 'items.$.qty': qty }
  });
}

/**
 * @param {object} payload
 * @param {string} payload.cartId
 * @param {string} payload.productId
 * @param {number} payload.qty
 */
export async function addItem(payload) {
  const { cartId, productId, qty } = payload;
  const cart = await Cart.findById(cartId);

  if (!cart) throw new Error('Not found');

  return Cart.updateOne({ _id: cartId }, {
    $push: { items: { product: productId, qty } },
  });
}

/**
 * @param {object} payload
 * @param {string} payload.cartId
 * @param {string} payload.productId
 */
export async function removeItem(payload) {
  const { cartId, productId } = payload;
  const cart = await Cart.findById(cartId);

  if (!cart) throw new Error('Not found');

  return Cart.updateOne({ _id: cartId }, {
    $pull: { items: { product: productId } },
  });
}
