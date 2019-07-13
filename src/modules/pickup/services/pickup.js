import { Pickup } from '../../../db/models';

/**
 * Create new pickup request.
 * @param {object} payload
 * @param {string} payload.date
 * @param {string} payload.userId
 * @param {string} payload.address
 * @param {string} payload.coordinate
 */
export function create(payload) {
  return Pickup.create({
    ...payload,
    user: payload.userId
  });
}

export function find(payload) {
  const { page = 1, limit = 20 } = payload;
  const query = {};

  if (payload.userId) query.user = payload.userId;

  return Pickup.paginate(query, {
    page,
    limit,
    customLabels: {
      docs: 'items',
      totalDocs: 'total'
    }
  });
}
