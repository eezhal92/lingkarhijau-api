import { DomainEvent } from '../../../lib/domain/event';

export class UserBalanceAddedEvent extends DomainEvent {
  /**
   * @param {object} options
   * @param {string} options.actor
   * @param {string} options.user
   * @param {number} options.amount
   * @param {object} options.transaction
   */
  constructor({ actor, user, amount, transaction } = {}) {
    super();

    this.data = {
      actor,
      user,
      amount,
      transaction,
      date: new Date().toISOString(),
    };
  }
}

export class UserBalanceReducedEvent extends DomainEvent {
  /**
   * @param {object} options
   * @param {string} options.actor
   * @param {string} options.user
   * @param {number} options.amount
   * @param {object} options.transaction
   */
  constructor({ actor, user, amount, transaction } = {}) {
    super();

    this.data = {
      actor,
      user,
      amount,
      transaction,
      date: new Date().toISOString(),
    };
  }
}
