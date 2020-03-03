import * as categoryService from '../../services/category';

function getCategories(request, response) {
  categoryService.getCategories()
    .then((categories) => {
      response.json({ categories });
    });
}

function getCategory(request, response) {
  response.json({ title: 'My Category' });
}

function createCategory(request, response) {
  categoryService.createCategory(request.body.name)
    .then((category) => {
      response.json({ category });
    });
}

function updateCategory(request, response) {
  response.json({ title: 'My Category' });
}

function removeCategory(request, response) {
  response.json({ message: 'Success' });
}

export default {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  removeCategory,
};
