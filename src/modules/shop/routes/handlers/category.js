function getCategories(request, response) {
  response.json({ categories: [] });
}

function getCategory(request, response) {
  response.json({ title: 'My Category' });
}

function createCategory(request, response) {
  response.json({ title: 'My Category' });
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
