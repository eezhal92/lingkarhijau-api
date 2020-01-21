import { Pickup, User } from '../../../db/models';
import { PickupStatus } from '../../../lib/pickup';

/**
 * Create new pickup request.
 * @param {object} payload
 * @param {string} payload.date
 * @param {string} payload.accountId
 * @param {string} payload.address
 * @param {string} payload.type
 * @param {string} payload.coordinate
 */
export function create(payload) {
  return Pickup.create({
    ...payload,
    account: payload.accountId
  });
}

/**
 * @param {object} payload
 * @param {number} payload.limit
 * @param {number} payload.page
 * @param {string} payload.account
 * @param {string} payload.day   today | tomorrow | after_tomorrow
 * @param {number} payload.status
 * @param {string} payload.actor the user id who do the request
 */
export function find(payload) {
  const { page = 1, limit = 20 } = payload;
  const query = {};

  if (payload.account) query.account = payload.account;
  if (typeof payload.status === 'number') query.status = payload.status;

  return Pickup.paginate(query, {
    page,
    limit,
    customLabels: {
      docs: 'items',
      totalDocs: 'total'
    },
    populate: [
      { path: 'account' },
      { path: 'assignee', select: 'name phone' }
    ],
    sort: { createdAt: -1 }
  });
}

/**
 * @param {object} payload
 * @param {string} payload.pickupId
 * @param {number} payload.status
 * @param {string} payload.address
 * @param {string} payload.type
 * @param {string} payload.coordinate
 * @param {string} payload.date
 */
export function update(payload) {
  // todo: logic to prevent fraud
  const { status, type, address, coordinate, date, assignee } = payload;

  return Pickup.findOneAndUpdate(
    { _id: payload.pickupId },
    {
      type,
      status,
      address,
      coordinate,
      date,
      assignee
    },
    { new: true }
  )
  .populate([
    { path: 'account' },
    { path: 'assignee', select: 'name phone' }
  ])
  .exec();
}

export async function cancel(pickupId) {
  const pickup = await Pickup.findById(pickupId);

  if (!pickup) throw new EntityNotFound('Not found');
  if (pickup.status === PickupStatus.DONE) {
    throw new Error('Cannot cancel completed pickup');
  }

  pickup.status = PickupStatus.CANCELLED;

  return pickup.save();
}
