import * as productService from '../../services/product';

async function getProducts(request, response) {
  const products = await productService.findProducts();
  response.json({ products });
}

async function getProduct(request, response) {
  const product = await productService.findProductByIdOrSlug(request.params.id)

  if (!product) return response.status(404).json({ message: 'Not found' });

  response.json({ product });
}

function createProduct(request, response, next) {
  const {
    title,
    description,
    price,
    images = [],
    categories = [],
    tags = [],
  } = request.body;

  productService.createProduct({
    title,
    price,
    description,
    images,
    categories,
    tags,
  })
    .then((product) => response.json({ product }))
    .catch(next);
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
