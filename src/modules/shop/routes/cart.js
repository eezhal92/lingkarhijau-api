import { Router } from 'express';
import { cart as handlers } from './handlers';
import { attachUserToRequest } from '../../../middlewares/auth';
import { createShouldValidated } from '../../../middlewares/input-validation';

const router = Router();

router.get('/:id', attachUserToRequest, handlers.getCart);
router.post(
  '/',
  attachUserToRequest,
  createShouldValidated({
    item: {
      qty: 'required|integer|min:1',
      product: {
        _id: 'required',
      },
    },
  }),
  handlers.createCart
);
router.delete('/:id', handlers.removeCart);

export default router;
