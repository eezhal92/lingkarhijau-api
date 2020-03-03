import { addHours } from 'date-fns';
import { ShopOrder, Cart } from '../../../db/models';

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
 * @param {string?}  payload.notes
 */
export async function createOrder(payload) {
  const { cartId, ...rest } = payload;
  const cart = await Cart.findById(cartId).populate('items.product').exec();

  if (!cart) throw new Error('Cart not found');

  const paymentDeadline = addHours(new Date(), 4);
  const total = getTotalOfCart(cart);
  const order = Object.assign(rest, {
    items: cart.toJSON().items,
    payment: {
      total,
      confirmationDeadline: paymentDeadline,
    },
  });

  console.log(order);

  // create order
  // todo: add short order id
  // todo: wrap it in mongodb trx
  // await ShopOrder.create(order);
  // await cart.remove();

  // todo: send notification by email or wa/sms

  // todo: the boolean value could be different
  // todo: when using midtrans
  // todo: it could be used to determine user's message
  return {
    needPaymentConfirmation: true,
    total,
    paymentDeadline,
    orderId: getOrderID(),
  };
}
