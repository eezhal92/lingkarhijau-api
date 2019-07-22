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
  if (payload.status) query.status = payload.status;

  return Pickup.paginate(query, {
    page,
    limit,
    customLabels: {
      docs: 'items',
      totalDocs: 'total'
    },
    sort: { createdAt: -1 }
  });
}

/**
 * @param {object} payload
 * @param {string} payload.pickupId
 * @param {number} payload.status
 * @param {string} payload.address
 * @param {string} payload.coordinate
 * @param {string} payload.date
 */
export function update(payload) {
  // todo: logic to prevent fraud
  const { status, address, coordinate, date } = payload;

  return Pickup.findOneAndUpdate(
    { _id: payload.pickupId },
    {
      status,
      address,
      coordinate,
      date
    },
    { new: true }
  );
}
