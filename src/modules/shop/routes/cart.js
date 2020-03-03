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
router.post(
  '/:id/items',
  attachUserToRequest,
  createShouldValidated({
    item: {
      qty: 'required|integer|min:1',
      product: {
        _id: 'required',
      },
    },
  }),
  handlers.addItem
);
router.put(
  '/:id/items/:productId',
  attachUserToRequest,
  createShouldValidated({
    item: {
      qty: 'required|integer|min:0',
      product: {
        _id: 'required',
      },
    },
  }),
  handlers.updateItemQty
);
router.delete('/:id', handlers.removeCart);

export default router;
