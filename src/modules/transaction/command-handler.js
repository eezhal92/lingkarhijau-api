import { createTransaction } from './domain/service';
import { UserBalanceAddedEvent, UserBalanceReducedEvent } from './domain/event';
import { TransactionTypes } from '../../lib/transaction';
import { PickupStatus } from '../../lib/pickup';

export class CreateTransactionCommandHandler {
  constructor (TransactionModel, userBalanceESRepo, PickupModel) {
    this.transactionModel = TransactionModel;
    this.pickupModel = PickupModel;
    this.userBalanceESRepo = userBalanceESRepo;
    this.handle = this.handle.bind(this);
  }

  /**
   * @param {import("./domain/command").CreateTransactionCommand} command
   */
  handle(command) {
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

    const userBalance = await this.userBalanceESRepo.findById(command.data.user);

    userBalance.apply(new UserBalanceAddedEvent({
      actor: command.data.actor,
      user: command.data.user,
      amount: command.data.amount,
      transaction: depositTrx.toObject(),
    }), true);
    userBalance.apply(new UserBalanceReducedEvent({
      actor: command.data.actor,
      user: command.data.user,
      amount: command.data.amount,
      transaction: donationTrx.toObject(),
    }), true);

    await this.markPickupRequestAsDone(command.data.pickup);

    return this.userBalanceESRepo.save(userBalance);
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
    const userBalance = await this.userBalanceESRepo.findById(command.data.user);

    userBalance.apply(new UserBalanceAddedEvent({
      actor: command.data.actor,
      user: command.data.user,
      amount: command.data.amount,
      transaction: trx.toObject(),
    }), true);

    await this.markPickupRequestAsDone(command.data.pickup);

    return this.userBalanceESRepo.save(userBalance);
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
    const userBalance = await this.userBalanceESRepo.findById(command.data.user);

    userBalance.apply(new UserBalanceAddedEvent({
      actor: command.data.actor,
      user: command.data.user,
      amount: command.data.amount,
      transaction: depositTrx.toObject(),
    }), true);
    userBalance.apply(new UserBalanceReducedEvent({
      actor: command.data.actor,
      user: command.data.user,
      amount: command.data.amount,
      transaction: redeemTrx.toObject(),
    }), true);

    await this.markPickupRequestAsDone(command.data.pickup);

    return this.userBalanceESRepo.save(userBalance);
  }

  /**
   * @param {import("./domain/command").CreateTransactionCommand} command
   */
  async _handleRedeem(command) {
    const redeemData = createTransaction(command.data);

    const trx = await this.transactionModel.create(redeemData);
    const userBalance = await this.userBalanceESRepo.findById(command.data.user);

    if (userBalance.balance < command.data.amount) {
      throw new Error(`User balance is not enough: ${userBalance.balance} < ${command.data.amount}`);
    }

    userBalance.apply(new UserBalanceReducedEvent({
      actor: command.data.actor,
      user: command.data.user,
      amount: command.data.amount,
      transaction: trx.toObject(),
    }), true);

    return this.userBalanceESRepo.save(userBalance);
  }
}
