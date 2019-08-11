export class CreateTransactionCommand {
  /**
   * @param {object}      options
   * @param {string}      options.actor   Who initiate the transaction
   * @param {string}      options.account
   * @param {number}      options.amount
   * @param {string}      options.type     quickcash | deposit | redeem | donation
   * @param {string?}     options.pickup
   * @param {Array<any>?} options.items
   */
  constructor({
    actor,
    account,
    type,
    amount,
    pickup = null,
    items = null,
  } = {}) {
    this.data = {
      actor,
      account,
      type,
      pickup,
      amount,
      items,
    };
  }
}
