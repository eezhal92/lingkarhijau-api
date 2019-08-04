import { Router } from 'express';

import { shouldAuthenticated } from '../../../middlewares/auth';
import { createShouldValidated } from '../../../middlewares/input-validation';

import { CreateTransactionCommand } from '../domain/command';
import { getTransactionTypes } from '../../../lib/transaction';

export function createRoute({ bus, TransactionReadModel }) {
  const router = Router();

  router.get(
    '/',
    shouldAuthenticated,
    function (request, response) {
      const { userId: actorId } = request;
      const page = Number(request.query.page || 1);
      const limit = Number(request.query.limit|| 20);

      const query = {};
      TransactionReadModel.paginate(query, {
        page,
        limit,
        customLabels: {
          docs: 'items',
          totalDocs: 'total'
        },
        sort: { createdAt: -1 }
      })
        .then((data) => {
          return response.json(data);
        })
    }
  );

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
