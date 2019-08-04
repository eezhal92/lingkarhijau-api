import { Router } from 'express';

import { shouldAuthenticated } from '../../../middlewares/auth';
import { createShouldValidated } from '../../../middlewares/input-validation';

import { getValidTrashTypes } from '../../../lib/trash-pricing';
import { CreateTrashPricingCommand, UpdateTrashPricingCommand } from '../command';

export function createRoute({ bus, TrashPricingReadModel }) {
  const router = Router();

  router.get(
    '/',
    shouldAuthenticated,
    function (request, response) {
      TrashPricingReadModel.find({})
        .then((trashPricings) => {
          return response.json({
            trashPricings,
          });
        });
    }
  );

  router.post(
    '/',
    shouldAuthenticated,
    createShouldValidated({
      name: 'required',
      price: 'required|numeric|min:1',
      type: `required|in:${getValidTrashTypes()}`,
    }),
    function (request, response) {
      const { name, price, type, description = '' } = request.body;

      bus.send(new CreateTrashPricingCommand({
        name,
        price,
        type,
        description,
      }));

      return response.json({
        message: new Date().toISOString() + ' Processing creation...'
      });
    }
  );

  router.patch(
    '/:id',
    shouldAuthenticated,
    createShouldValidated({
      name: 'required',
      price: 'required|numeric|min:1',
      type: `required|in:${getValidTrashTypes()}`,
    }),
    function (request, response) {
      const { name, price, type, description = '' } = request.body;
      const { id } = request.params;

      bus.send(new UpdateTrashPricingCommand({
        id,
        name,
        price,
        type,
        description,
      }));

      return response.json({
        message: 'Processing update...'
      });
    }
  );

  return router;
}
