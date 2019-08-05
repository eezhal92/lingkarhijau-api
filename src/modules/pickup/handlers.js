import * as pickupService from './services/pickup';
import { EntityNotFound } from '../../lib/errors';

export async function getAll(request, response) {
  const result = await pickupService.find({
    actor: request.userId,
    day: request.query.day,
    page: Number(request.query.page || 1),
    limit: Number(request.query.limit|| 20),
    status: request.query.status,
  });

  response.json(result);
}

export async function create(request, response, next) {
  const userId = request.userId;
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
      userId,
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
