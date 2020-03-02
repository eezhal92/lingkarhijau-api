import { Router } from 'express';
import { cart as handlers } from './handlers';

const router = Router();

router.get('/:id', handlers.getCart);
router.post('/', handlers.createCart);
router.delete('/:id', handlers.removeCart);

export default router;
