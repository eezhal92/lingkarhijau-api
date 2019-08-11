import { TransactionTypes } from '../../../lib/transaction';

/**
 * @param {object}      payload
 * @param {string}      payload.account
 * @param {string}      payload.type
 * @param {number}      payload.amount
 * @param {string?}     payload.pickup
 * @param {Array<any>?} payload.items
 */
export function createTransaction(payload) {
  let totalAmount = payload.amount;

  if (payload.type !== TransactionTypes.REDEEM) {
    totalAmount = getItemsTotalAmount(payload.items);
  }

  const meta = getTransactionMeta({
    ...payload,
    amount: totalAmount,
  });

  return {
    account: payload.account,
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
 * @param {object} payload.account
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
 * @param {string} payload.account
 * @param {number} payload.amount
 * @param {import("../types").TrashItem[]} payload.items
 */
function getDepositMeta(payload) {
  return {
    type: TransactionTypes.DEPOSIT,
    amount: payload.amount,
    depositor: payload.account,
    items: payload.items
  };
}

/**
 * @param {object} payload
 * @param {string} payload.account
 * @param {number} payload.amount
 * @param {import("../types").TrashItem[]} payload.items
 */
function getQuickCashMeta(payload) {
  return {
    type: TransactionTypes.QUICKCASH,
    account: payload.account,
    amount: payload.amount,
    items: payload.items,
  };
}

/**
 * @param {object} payload
 * @param {string} payload.account
 * @param {number} payload.amount
 */
function getDonationMeta(payload) {
  return {
    type: TransactionTypes.DONATION,
    donator: payload.account,
    amount: payload.amount
  };
}

/**
 * @param {object} payload
 * @param {string} payload.account
 * @param {number} payload.amount
 */
function getRedeemMeta(payload) {
  return {
    type: TransactionTypes.REDEEM,
    account: payload.account,
    amount: payload.amount
  };
}
