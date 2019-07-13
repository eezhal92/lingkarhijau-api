import { Router } from 'express';

import * as handlers from './handlers';

const router = Router();

router.post('/password/request', handlers.requestResetPassword);
router.get('/password/request/:code', handlers.getResetPasswordRequest);
router.post('/password', handlers.saveNewPassword);

export default router;
