import { Router } from 'express';
import { product as handlers } from './handlers';

const router = Router();

router.get('/', handlers.getProducts);
router.get('/:id', handlers.getProduct);
router.post('/', handlers.createProduct);
router.put('/:id', handlers.createProduct);
router.delete('/:id', handlers.removeProduct);

export default router;
