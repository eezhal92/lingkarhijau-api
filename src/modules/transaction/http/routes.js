import { Router } from 'express';

import { shouldAuthenticated } from '../../../middlewares/auth';
import { createShouldValidated } from '../../../middlewares/input-validation';

import { CreateTransactionCommand } from '../domain/command';
import { getTransactionTypes } from '../../../lib/transaction';

export function createRoute({ bus }) {
  const router = Router();

  router.post(
    '/',
    shouldAuthenticated,
    createShouldValidated({
      amount: 'required|integer',
      user: 'required', // the customer
      type: `required|in:${getTransactionTypes()}`,
    }),
    function (request, response) {
      const { userId: actorId } = request;
      const { amount, user: userId, type, items, pickup } = request.body;

      // todo: validate pickup and items, if the type either of donation, deposit, or quickcash
      // todo: validate if the user customer exists or not

      bus.send(new CreateTransactionCommand({
        actor: actorId,
        user: userId,
        type,
        amount,
        items,
        pickup,
      }));

      return response.json({
        message: new Date().toISOString() + ' Processing creation...'
      });
    }
  );

  return router;
}
