/**
 * Root router
 */

import { Router } from 'express';
import { routes as authRoutes } from './modules/auth';
import { routes as accountRoutes } from './modules/account';
import { routes as pickupRoutes } from './modules/pickup';

import { createRoute } from './modules/trash-pricing/http/routes';

export default function createRoutes(cradle) {
  const router = Router();

  router.use('/auth', authRoutes);
  router.use('/accounts', accountRoutes);
  router.use('/pickups', pickupRoutes);

  router.use('/trash-pricings', createRoute(cradle))

  return router;
}
