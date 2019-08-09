import { Router } from 'express';

import { shouldAuthenticated } from '../../../middlewares/auth';
import { createShouldValidated } from '../../../middlewares/input-validation';

import { getValidTrashTypes } from '../../../lib/trash-pricing';
import {
  CreateTrashPricingCommand,
  UpdateTrashPricingCommand,
  ToggleTrashPricingCommand,
} from '../command';

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
      unit: 'required|in:kg',
      price: 'required|numeric|min:1',
      type: `required|in:${getValidTrashTypes()}`,
    }),
    function (request, response) {
      const { userId } = request;
      const { name, price, type, unit, description = '' } = request.body;

      bus.send(new CreateTrashPricingCommand({
        actor: userId,
        name,
        price,
        unit,
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
      unit: 'required|in:kg',
      price: 'required|numeric|min:1',
      type: `required|in:${getValidTrashTypes()}`,
    }),
    function (request, response) {
      const { userId } = request;
      const { name, price, type, unit, description = '' } = request.body;
      const { id } = request.params;

      bus.send(new UpdateTrashPricingCommand({
        actor: userId,
        id,
        name,
        price,
        type,
        unit,
        description,
      }));

      return response.json({
        message: 'Processing update...'
      });
    }
  );

  router.patch(
    '/:id/archives',
    shouldAuthenticated,
    createShouldValidated({
      archived: 'required|boolean',
    }),
    function (request, response) {
      const { userId } = request;
      const { archived } = request.body;
      const { id } = request.params;

      bus.send(new ToggleTrashPricingCommand({
        actor: userId,
        id,
        archived,
      }));

      return response.json({
        message: 'Processing archive...'
      });
    }
  );

  return router;
}
