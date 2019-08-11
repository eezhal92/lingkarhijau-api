export class AccountBalanceView {
  constructor(AccountBalanceModel) {
    this.accountBalanceModel = AccountBalanceModel;
    this.handle = this.handle.bind(this);
  }

  /**
   * @param {object} event
   * @param {object} event.data
   * @param {string} event.data.account
   */
  async handle(event) {
    let accountBalance = await this.accountBalanceModel.findOne({ account: event.data.account });

    if (event.name ===  'AccountBalanceAddedEvent') {
      accountBalance.balance += event.data.amount;
    } else if (event.name === 'AccountBalanceReducedEvent') {
      accountBalance.balance -= event.data.amount;
    }

    return accountBalance.save()
      .then((data) => {
        console.log('AccountBalanceView projection finished!');
        console.log('After Balance:', data.balance);
      });
  }
}
