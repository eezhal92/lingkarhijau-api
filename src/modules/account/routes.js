import { Router } from 'express';
import * as handlers from './handlers';
import { shouldAuthenticated } from '../../middlewares/auth';

const router = Router();

router.get('/me', shouldAuthenticated, handlers.getMe);
router.post('/activation', handlers.activate);
router.post('/password/request', handlers.requestResetPassword);
router.get('/password/request/:code', handlers.getResetPasswordRequest);
router.post('/password', handlers.saveNewPassword);

export default router;
