import { Pickup, User } from '../../../db/models';
import { PickupStatus } from '../../../lib/pickup';

/**
 * Create new pickup request.
 * @param {object} payload
 * @param {string} payload.date
 * @param {string} payload.userId
 * @param {string} payload.address
 * @param {string} payload.type
 * @param {string} payload.coordinate
 */
export function create(payload) {
  return Pickup.create({
    ...payload,
    user: payload.userId
  });
}

/**
 * @param {object} payload
 * @param {number} payload.limit
 * @param {number} payload.page
 * @param {string} payload.day   today | tomorrow | after_tomorrow
 * @param {number} payload.status
 * @param {string} payload.actor the user id who do the request
 */
export function find(payload) {
  const { page = 1, limit = 20, actor } = payload;

  return User.findById(actor)
    .then((data) => {
      // todo: do validation. and use constants
      const isMember = data.type === "MEMBER";
      return isMember;
    })
    .then((isMember) => {
      const query = {};

      if (isMember) query.user = payload.actor;
      if (typeof payload.status === 'number') query.status = payload.status;

      return Pickup.paginate(query, {
        page,
        limit,
        customLabels: {
          docs: 'items',
          totalDocs: 'total'
        },
        populate: { path: 'user' },
        sort: { createdAt: -1 }
      });
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
  const { status, type, address, coordinate, date } = payload;

  return Pickup.findOneAndUpdate(
    { _id: payload.pickupId },
    {
      type,
      status,
      address,
      coordinate,
      date
    },
    { new: true }
  );
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
