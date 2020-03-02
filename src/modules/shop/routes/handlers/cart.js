function createCart(request, response) {
  response.json({ id: 'cart-01' });
}

function getCart(request, response) {
  response.json({ id: 'cart-01' });
}

function removeCart(request, response) {
  response.json({ message: 'Success' });
}

export default {
  createCart,
  getCart,
  removeCart,
};
