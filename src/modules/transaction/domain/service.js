import { TransactionTypes } from '../../../lib/transaction';

/**
 * @param {object}      payload
 * @param {string}      payload.user
 * @param {string}      payload.type
 * @param {string?}     payload.pickup
 * @param {Array<any>?} payload.items
 */
export function createTransaction(payload) {
  const totalAmount = getItemsTotalAmount(payload.items);
  const meta = getTransactionMeta({
    ...payload,
    amount: totalAmount,
  });

  return {
    user: payload.user,
    type: payload.type,
    pickup: payload.pickup,
    amount: totalAmount,
    meta,
  };
}

/**
 * @param {import("../types").TrashItem} items
 * @return {number}
 */
function getItemsTotalAmount(items) {
  return items.reduce((accumulation, item) => {
    return accumulation + (item.price * item.qty);
  }, 0);
}

/**
 * @param {object} payload
 * @param {object} payload.user
 * @param {import("../types").TransactionType} payload.type
 * @param {import("../types").TrashItem[]} payload.items
 */
function getTransactionMeta(payload) {
  switch (payload.type) {
    case TransactionTypes.DEPOSIT:
      return getDepositMeta(payload);
    case TransactionTypes.QUICKCASH:
      return getQuickCashMeta(payload);
    case TransactionTypes.DONATION:
      return getDonationMeta(payload);
    case TransactionTypes.REDEEM:
      return getRedeemMeta(payload);
    default:
      throw new Error(payload.type + ': transaction type is not recognized.');
  }
}

/**
 * @param {object} payload
 * @param {string} payload.user
 * @param {number} payload.amount
 * @param {import("../types").TrashItem[]} payload.items
 */
function getDepositMeta(payload) {
  return {
    type: TransactionTypes.DEPOSIT,
    amount: payload.amount,
    depositor: payload.user,
    items: payload.items
  };
}

/**
 * @param {object} payload
 * @param {string} payload.user
 * @param {number} payload.amount
 * @param {import("../types").TrashItem[]} payload.items
 */
function getQuickCashMeta(payload) {
  return {
    type: TransactionTypes.QUICKCASH,
    user: payload.user,
    amount: payload.amount,
    items: payload.items,
  };
}

/**
 * @param {object} payload
 * @param {string} payload.user
 * @param {number} payload.amount
 */
function getDonationMeta(payload) {
  return {
    type: TransactionTypes.DONATION,
    donator: payload.user,
    amount: payload.amount
  };
}

/**
 * @param {object} payload
 * @param {string} payload.user
 * @param {number} payload.amount
 */
function getRedeemMeta(payload) {
  return {
    type: TransactionTypes.REDEEM,
    user: payload.user,
    amount: payload.amount
  };
}
