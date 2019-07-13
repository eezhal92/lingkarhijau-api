import * as pickupService from './services/pickup';
import { EntityNotFound } from '../../lib/errors';

export async function getAll(request, response) {
  const result = await pickupService.find({
    page: Number(request.query.page || 1),
    limit: Number(request.query.limit|| 20),
  })

  response.json(result);
}

export async function create(request, response, next) {
  const userId = request.userId;
  const {
    date,
    address,
    coordinate,
  } = request.body;

  let pickup = null;

  try {
    pickup = await pickupService.create({
      userId,
      date,
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
  } = request.body;

  let pickup = null;

  try {
    pickup = await pickupService.update({
      pickupId: request.params.id,
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
