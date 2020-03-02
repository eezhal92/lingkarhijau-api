function getProducts(request, response) {
  response.json({ products: [] });
}

function getProduct(request, response) {
  response.json({ title: 'My Product' });
}

function createProduct(request, response) {
  response.json({ title: 'My Product' });
}

function updateProduct(request, response) {
  response.json({ title: 'My Product' });
}

function removeProduct(request, response) {
  response.json({ message: 'Success' });
}

export default {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  removeProduct,
};
