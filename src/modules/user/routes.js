import { Router } from 'express';
import * as handlers from './handlers';
import { shouldAuthenticated } from '../../middlewares/auth';

const router = Router();

router.get('/', handlers.getUsers);

export default router;
