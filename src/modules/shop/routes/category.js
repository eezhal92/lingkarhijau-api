import { Router } from 'express';
import { category as handlers } from './handlers';

const router = Router();

router.get('/', handlers.getCategories);
router.get('/:id', handlers.getCategory);
router.post('/', handlers.createCategory);
router.put('/:id', handlers.updateCategory);
router.delete('/:id', handlers.removeCategory);

export default router;
