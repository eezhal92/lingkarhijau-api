import * as pickupService from './services/pickup';
import { EntityNotFound } from '../../lib/errors';

export async function getAll(request, response) {
  const status = Number(request.query.status);
  const result = await pickupService.find({
    user: request.query.user,
    day: request.query.day,
    page: Number(request.query.page || 1),
    limit: Number(request.query.limit|| 20),
    status: isNaN(status) ? undefined : status,
  });

  response.json(result);
}

export async function create(request, response, next) {
  const accountId = request.accountId;
  const {
    date,
    note = '',
    address,
    type,
    coordinate,
  } = request.body;

  let pickup = null;

  try {
    pickup = await pickupService.create({
      accountId,
      date,
      note,
      type,
      address,
      coordinate,
    });
  } catch (error) {
    return next(error);
  }

  return response.json({
    pickup,
  });
}

export async function update(request, response, next) {
  const {
    date,
    address,
    coordinate,
    status,
    type,
  } = request.body;

  let pickup = null;

  try {
    pickup = await pickupService.update({
      pickupId: request.params.id,
      type,
      status,
      date,
      address,
      coordinate,
    });
  } catch (error) {
    if (error instanceof EntityNotFound) {
      return next(new NotFoundError('Pickup data not found'));
    }
  }

  return response.json({
    pickup,
  });
}

export async function cancel(request, response, next) {
  const { id } = request.params;
  const { userId } = request;

  console.log(`user: ${userId} trying to cancel pickup request: ${id}`);

  return pickupService.cancel(id)
    .then(pickup => response.json({
      pickup,
    }))
    .catch((error) => {
      next(error);
    });
}
