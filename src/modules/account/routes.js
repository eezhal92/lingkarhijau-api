import { Router } from 'express';
import * as handlers from './handlers';
import { shouldAuthenticated } from '../../middlewares/auth';

const router = Router();

/**
 * users
 *
 * GET  /users/me get   - currently logged in
 * POST /users/password - save password
 */

/**
 * accounts
 *
 * GET  /accounts                  - get all accounts
 * POST /accounts/activation       - activate account and user
 * GET  /accounts/:id              - get account
 * GET  /accounts/:id/transactions - get account
 * GET  /accounts/:id/users        - get users associated with particular account
 * POST /accounts/:id/users        - add new user to particular account
 */

/**
 * password requests
 *
 * POST /password-requests       - create new password request
 * GET  /password-requests/:code - retrieve password request
 */

router.get('/me', shouldAuthenticated, handlers.getMe);
router.get('/me/transactions', shouldAuthenticated, handlers.getTransactions);
router.post('/activation', handlers.activate);

router.post('/password/request', handlers.requestResetPassword);
router.get('/password/request/:code', handlers.getResetPasswordRequest);
router.post('/password', handlers.saveNewPassword);

export default router;
