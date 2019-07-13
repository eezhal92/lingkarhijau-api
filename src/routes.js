/**
 * Root router
 */

import { Router } from 'express';
import { routes as authRoutes } from './modules/auth';
import { routes as accountRoutes } from './modules/account';

const router = Router();

router.use('/auth', authRoutes);
router.use('/account', accountRoutes);

export default router;
