import { Router } from 'express';
import { product as handlers } from './handlers';
import { createShouldValidated } from '../../../middlewares/input-validation';

const router = Router();

router.get('/', handlers.getProducts);
router.get('/:id', handlers.getProduct);
router.post('/',
  createShouldValidated({
    title: 'required|min:2',
    description: 'required',
    price: 'required|min:0',
  }),
  handlers.createProduct
);
router.put('/:id', handlers.updateProduct);
router.delete('/:id', handlers.removeProduct);

export default router;
