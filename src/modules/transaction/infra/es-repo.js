import { AccountBalance } from '../domain/model';

export class AccountBalanceRepo {
  constructor({ eventstore }) {
    this.es = eventstore;
  }

  findById (id) {
    return new Promise((resolve, reject) => {
      this.es.getFromSnapshot({
        aggregateId: id,
        aggregate: 'accountBalance',
      }, function (error, snapshot, stream) {
        if (error) return reject(error);

        const history = stream.events;
        const accountBalance = new AccountBalance({ id });

        accountBalance.loadSnapshot(snapshot);
        accountBalance.loadFromHistory(history.map(history => history.payload));

        return resolve(accountBalance);
      })
    });
  }

  save (accountBalance) {
    return new Promise((resolve, reject) => {
      this.es.getFromSnapshot({
        aggregateId: accountBalance.id,
        aggregate: 'accountBalance'
      }, async function (error, snapshot, stream) {
        if (error) return reject(error);

        const uncommitedChanges = accountBalance.getUncommittedChanges();

        for (let i = 0; i < uncommitedChanges.length; i += 1) {
          const event = uncommitedChanges[i];
          stream.addEvent(event);
        }

        stream.commit();
        accountBalance.markChangesAsCommitted();

        resolve();
      });
    });
  }
}
