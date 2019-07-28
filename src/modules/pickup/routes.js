import { Router } from 'express';
import { getPickupTypes } from '../../lib/pickup';
import { shouldAuthenticated } from '../../middlewares/auth';
import { createShouldValidated } from '../../middlewares/input-validation';

import * as handlers from './handlers';

const router = Router();

router.get('/', shouldAuthenticated, handlers.getAll);
router.patch(
  '/:id',
  shouldAuthenticated,
  createShouldValidated({
    type: 'required|in:' + getPickupTypes(),
    address: 'required',
    coordinate: 'required',
    date: 'required|date',
    status: 'required|integer|between:1,3' // see PickupStatus
  }),
  handlers.update
);
router.post(
  '/',
  shouldAuthenticated,
  createShouldValidated({
    type: 'required|in:' + getPickupTypes(),
    address: 'required',
    coordinate: 'required',
    date: 'required|date',
  }),
  handlers.create
);

export default router;
