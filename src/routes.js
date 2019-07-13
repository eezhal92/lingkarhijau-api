/**
 * Root router
 */

import { Router } from 'express';
import { routes as authRoutes } from './modules/auth';

const router = Router();

router.use('/auth', authRoutes);

export default router;
