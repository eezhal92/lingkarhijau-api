/**
 * Root router
 */

import { Router } from 'express';
import { routes as authRoutes } from './modules/auth';
import { routes as accountRoutes } from './modules/account';
import { routes as pickupRoutes } from './modules/pickup';

const router = Router();

router.use('/auth', authRoutes);
router.use('/accounts', accountRoutes);
router.use('/pickups', pickupRoutes);

export default router;
