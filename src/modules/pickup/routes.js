import { Router } from 'express';
import { shouldAuthenticated } from '../../middlewares/auth';
import { createShouldValidated } from '../../middlewares/input-validation';

import * as handlers from './handlers';

const router = Router();

router.get('/', shouldAuthenticated, handlers.getAll);
router.post(
  '/',
  shouldAuthenticated,
  createShouldValidated({
    address: 'required',
    coordinate: 'required',
    date: 'required|date',
  }),
  handlers.create
);

export default router;
