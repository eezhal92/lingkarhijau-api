import { addHours } from 'date-fns';
import { Product, ShopOrder, Cart } from '../../../db/models';

function getOrderID() {
  // todo: real implementatino
  return Date.now();
}

function getTotalOfCart(cart) {
  return cart.items.reduce((acc, item) => {
    return acc + (item.product.price * item.qty);
  }, 0);
}

/**
 * @param  {object} cart
 * @return {string[]}
 */
function getProductIds(cart) {
  return cart.items.map(item => item.product._id);
}

/**
 * @param {object}   payload
 * @param {string}   payload.cartId
 * @param {object}   payload.customer
 * @param {string}   payload.customer.name
 * @param {string}   payload.customer.phone
 * @param {string?}  payload.customer.email
 * @param {string?}  payload.customer.user
 * @param {object}   payload.shipment
 * @param {string}   payload.shipment.date
 * @param {string}   payload.shipment.address
 * @param {string}   payload.shipment.city
 * @param {string?}  payload.shipment.zipCode
 * @param {string?}  payload.shipment.coordinate
 * @param {string?}  payload.payment.method
 * @param {string?}  payload.notes
 */
export async function createOrder(payload) {
  const { cartId, ...rest } = payload;
  let cart;

  try {
    cart = await Cart.findById(cartId).populate('items.product').exec();
  } catch (err) {
    throw err;
  }

  if (!cart) throw new Error('Cart not found');

  const paymentDeadline = addHours(new Date(), 4);
  const total = getTotalOfCart(cart);
  const data = Object.assign(rest, {
    items: cart.toJSON().items,
    payment: {
      method: rest.payment.method,
      total,
      confirmationDeadline: paymentDeadline,
    },
  });

  // create order
  // todo: add short order id
  // todo: wrap it in mongodb trx
  let order;

  try {
    order = await ShopOrder.create(data);
    // deduct stock
    const productIds = getProductIds(cart);
    const products = await Product.find({ _id: { $in: productIds }});

    products.forEach((product) => {
      const item = cart.items.find(item => item.product._id.toString() === product._id.toString());
      product.update({ stock: product.stock - item.qty }).exec();
    });

    await cart.remove();
  } catch (err) {
    throw err;
  }

  // todo: send notification by email or wa/sms
  // todo: the boolean value could be different
  // todo: when using midtrans
  // todo: it could be used to determine user's message
  return {
    needPaymentConfirmation: true,
    total,
    paymentDeadline,
    orderId: order._id,
  };
}
