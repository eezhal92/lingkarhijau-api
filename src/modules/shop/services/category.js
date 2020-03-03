import { ProductCategory } from '../../../db/models';
import { createSlug } from './helpers';

export function createCategory(name) {
  return ProductCategory.create({
    name,
    slug: createSlug(name)
  });
}

export function getCategories() {
  return ProductCategory.find({});
}
