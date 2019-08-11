import { PickupStatus } from '../../lib/pickup';
import { createTransaction } from './domain/service';
import { TransactionTypes } from '../../lib/transaction';
import { AccountBalanceAddedEvent, AccountBalanceReducedEvent } from './domain/event';

export class CreateTransactionCommandHandler {
  constructor (TransactionModel, accountBalanceESRepo, PickupModel) {
    this.transactionModel = TransactionModel;
    this.pickupModel = PickupModel;
    this.accountBalanceESRepo = accountBalanceESRepo;
    this.handle = this.handle.bind(this);
  }

  /**
   * @param {import("./domain/command").CreateTransactionCommand} command
   */
  handle(command) {
    switch(command.data.type) {
      case 'deposit':
      case 'donation':
      case 'quickcash':
        this._validatePickup(command);
    }

    switch(command.data.type) {
      case 'deposit':
        return this._handleDeposit(command);
      case 'donation':
        return this._handleDonation(command);
      case 'quickcash':
        return this._handleQuickCash(command);
      case 'redeem':
          return this._handleRedeem(command);
    }
  }

  async _validatePickup(command) {
    // todo: fix this validation. still not works
    if (!command.data.pickup) return;

    const pickup = await this.pickupModel.findById(command.data.pickup);

    if (!pickup) throw new Error('Pickup not found');
    if (pickup.status !== PickupStatus.PLACED) throw new Error('This pickup either has been cancelled or done');
  }

  /**
   * @param {import("./domain/command").CreateTransactionCommand} command
   */
  async _handleDonation(command) {
    // We want to add two transactions
    // First is for deposit,
    // And then we donate the amount of the deposit

    const depositData = createTransaction({
      ...command.data,
      type: TransactionTypes.DEPOSIT,
    });
    const donationData = createTransaction(command.data);

    const depositTrx = await this.transactionModel.create(depositData);
    const donationTrx = await this.transactionModel.create(donationData);

    const accountBalance = await this.accountBalanceESRepo.findById(command.data.account);

    accountBalance.apply(new AccountBalanceAddedEvent({
      actor: command.data.actor,
      account: command.data.account,
      amount: command.data.amount,
      transaction: depositTrx.toObject(),
    }), true);
    accountBalance.apply(new AccountBalanceReducedEvent({
      actor: command.data.actor,
      account: command.data.account,
      amount: command.data.amount,
      transaction: donationTrx.toObject(),
    }), true);

    await this.markPickupRequestAsDone(command.data.pickup);

    return this.accountBalanceESRepo.save(accountBalance);
  }

  async markPickupRequestAsDone(pickupId) {
    if (!pickupId) return Promise.resolve();

    const pickupRequest = await this.pickupModel.findById(pickupId);

    if (!pickupRequest) return Promise.resolve();

    pickupRequest.status = PickupStatus.DONE;

    return pickupRequest.save();
  }

  /**
   * @param {import("./domain/command").CreateTransactionCommand} command
   */
  async _handleDeposit(command) {
    const depositData = createTransaction(command.data);

    const trx = await this.transactionModel.create(depositData);
    const accountBalance = await this.accountBalanceESRepo.findById(command.data.account);

    accountBalance.apply(new AccountBalanceAddedEvent({
      actor: command.data.actor,
      account: command.data.account,
      amount: command.data.amount,
      transaction: trx.toObject(),
    }), true);

    await this.markPickupRequestAsDone(command.data.pickup);

    return this.accountBalanceESRepo.save(accountBalance);
  }

  /**
   * @param {import("./domain/command").CreateTransactionCommand} command
   */
  async _handleQuickCash(command) {
    const depositData = createTransaction({
      ...command.data,
      type: TransactionTypes.DEPOSIT,
    });
    const redeemData = createTransaction({
      ...command.data,
      type: TransactionTypes.REDEEM,
    });

    const depositTrx = await this.transactionModel.create(depositData);
    const redeemTrx = await this.transactionModel.create(redeemData);
    const accountBalance = await this.accountBalanceESRepo.findById(command.data.account);

    accountBalance.apply(new AccountBalanceAddedEvent({
      actor: command.data.actor,
      account: command.data.account,
      amount: command.data.amount,
      transaction: depositTrx.toObject(),
    }), true);
    accountBalance.apply(new AccountBalanceReducedEvent({
      actor: command.data.actor,
      account: command.data.account,
      amount: command.data.amount,
      transaction: redeemTrx.toObject(),
    }), true);

    await this.markPickupRequestAsDone(command.data.pickup);

    return this.accountBalanceESRepo.save(accountBalance);
  }

  /**
   * @param {import("./domain/command").CreateTransactionCommand} command
   */
  async _handleRedeem(command) {
    const redeemData = createTransaction(command.data);

    const trx = await this.transactionModel.create(redeemData);
    const accountBalance = await this.accountBalanceESRepo.findById(command.data.account);

    if (accountBalance.balance < command.data.amount) {
      throw new Error(`Account balance is not enough: ${accountBalance.balance} < ${command.data.amount}`);
    }

    accountBalance.apply(new AccountBalanceReducedEvent({
      actor: command.data.actor,
      account: command.data.account,
      amount: command.data.amount,
      transaction: trx.toObject(),
    }), true);

    return this.accountBalanceESRepo.save(accountBalance);
  }
}
