import { UserBalanceAddedEvent, UserBalanceReducedEvent } from './domain/event';

export class UserBalanceView {
  constructor(UserBalanceModel) {
    this.userBalanceModel = UserBalanceModel;
    this.handle = this.handle.bind(this);
  }

  /**
   * @param {object} event
   * @param {object} event.data
   * @param {string} event.data.user
   */
  async handle(event) {
    let userBalance = await this.userBalanceModel.findOne({ user: event.data.user });

    if (event instanceof UserBalanceAddedEvent) {
      userBalance.balance += event.data.amount;
    } else if (event instanceof UserBalanceReducedEvent) {
      userBalance.balance -= event.data.amount;
    }

    return userBalance.save();
  }
}
