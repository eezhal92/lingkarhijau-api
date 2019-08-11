import { Router } from 'express';
import * as handlers from './handlers';
import { createShouldValidated } from '../../middlewares/input-validation';

const router = Router();

router.post(
  '/login',
  createShouldValidated({
    email: 'required|email',
    password: 'required|min:8',
    mode: 'required|in:enduser,backoffice,operator'
  }),
  handlers.login
);

router.post(
  '/register',
  createShouldValidated({
    name: 'required|min:2',
    phone: 'required|min:8',
    email: 'required|email',
    password: 'required|min:8',
    address: 'required',
    accountType: 'required',
    accountSubType: 'required',
  }),
  handlers.register
);

export default router;
