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

    if (event.name ===  'UserBalanceAddedEvent') {
      userBalance.balance += event.data.amount;
    } else if (event.name === 'UserBalanceReducedEvent') {
      userBalance.balance -= event.data.amount;
    }

    return userBalance.save()
      .then((data) => {
        console.log('UserBalanceView projection finished!');
        console.log('After Balance:', data.balance);
      });
  }
}
