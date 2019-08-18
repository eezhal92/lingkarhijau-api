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
      const { account } = request.query;
      const page = Number(request.query.page || 1);
      const limit = Number(request.query.limit|| 20);

      const query = {};

      if (account) query.account = account;

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
    // todo validate roles
    shouldAuthenticated,
    createShouldValidated({
      amount: 'required|integer',
      account: 'required', // the customer
      type: `required|in:${getTransactionTypes()}`,
    }),
    function (request, response) {
      const { user } = request;
      const { amount, account: accountId, type, items, pickup } = request.body;

      // todo: validate pickup and items, if the type either of donation, deposit, or quickcash
      // todo: validate if the user customer exists or not

      bus.send(new CreateTransactionCommand({
        actor: user.id,
        account: accountId,
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
