import * as cartService from '../../services/cart';

function createCart(request, response) {
  const userId = request.user && request.user.id;
  const { item } = request.body;

  cartService.createCart({
    item: {
      qty: item.qty,
      productId: item.product._id,
    },
    user: userId || null,
  })
    .then((cart) => {
      response.json({ cart });
    });
}

function getCart(request, response) {
  const cartId = request.params.id;
  const userId = request.user && request.user.id;

  cartService.findCart({ cartId, userId })
    .then((cart) => {
      if (!cart) {
        return response.status(404).json({
          message: 'No cart',
        });
      }
      response.json({ cart });
    });
}

function removeCart(request, response) {
  response.json({ message: 'Success' });
}

export default {
  createCart,
  getCart,
  removeCart,
};
