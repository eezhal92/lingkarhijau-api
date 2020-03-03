import { Router } from 'express';
import { order as handlers } from './handlers';
import { attachUserToRequest } from '../../../middlewares/auth';
import { createShouldValidated } from '../../../middlewares/input-validation';

const router = Router();

router.post('/',
  createShouldValidated({
    cartId: 'required',
    customer: {
      name: 'required|min:2',
      phone: 'required|min:5',
      email: 'email',
    },
    shipment: {
      address: 'required',
      date: 'required|date',
      city: 'required',
    }
  }),
  attachUserToRequest,
  handlers.createOrder
);

export default router;
