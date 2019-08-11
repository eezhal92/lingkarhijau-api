import { DomainEvent } from '../../../lib/domain/event';

export class AccountBalanceAddedEvent extends DomainEvent {
  /**
   * @param {object} options
   * @param {string} options.actor
   * @param {string} options.account
   * @param {number} options.amount
   * @param {object} options.transaction
   */
  constructor({ actor, account, amount, transaction } = {}) {
    super();

    this.data = {
      actor,
      account,
      amount,
      transaction,
      date: new Date().toISOString(),
    };
  }
}

export class AccountBalanceReducedEvent extends DomainEvent {
  /**
   * @param {object} options
   * @param {string} options.actor
   * @param {string} options.account
   * @param {number} options.amount
   * @param {object} options.transaction
   */
  constructor({ actor, account, amount, transaction } = {}) {
    super();

    this.data = {
      actor,
      account,
      amount,
      transaction,
      date: new Date().toISOString(),
    };
  }
}
