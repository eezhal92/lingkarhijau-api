import { Router } from 'express';
import { category as handlers } from './handlers';
import { createShouldValidated } from '../../../middlewares/input-validation';

const router = Router();

router.get('/', handlers.getCategories);
router.get('/:id', handlers.getCategory);
router.post(
  '/',
  createShouldValidated({ name: 'required|min:2'}),
  handlers.createCategory
);
router.put('/:id', handlers.updateCategory);
router.delete('/:id', handlers.removeCategory);

export default router;
