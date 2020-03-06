import * as productService from '../../services/product';

async function getProducts(request, response) {
  const data = await productService.findProducts({
    category: request.query.category,
    search: request.query.search,
    page: request.query.page,
    limit: request.query.limit,
  });
  response.json(data);
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
    unit,
    stock,
    category,
  } = request.body;

  productService.createProduct({
    title,
    price,
    description,
    images,
    categories,
    tags,
    unit,
    stock,
    category,
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
