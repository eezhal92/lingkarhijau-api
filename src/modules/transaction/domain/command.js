export class CreateTransactionCommand {
  /**
   * @param {object}      options
   * @param {string}      options.actor   Who initiate the transaction
   * @param {string}      options.user
   * @param {number}      options.amount
   * @param {string}      options.type     quickcash | deposit | redeem | donation
   * @param {string?}     options.pickup
   * @param {Array<any>?} options.items
   */
  constructor({
    actor,
    user,
    type,
    amount,
    pickup = null,
    items = null,
  } = {}) {
    this.data = {
      actor,
      user,
      type,
      pickup,
      amount,
      items,
    };
  }
}
