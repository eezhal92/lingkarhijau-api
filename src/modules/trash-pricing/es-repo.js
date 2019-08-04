import { TrashPricing } from './domain';

export class TrashPricingESRepo {
  constructor ({ eventstore }) {
    this.es = eventstore;
  }

  findById(id) {
    return new Promise((resolve, reject) => {
      this.es.getFromSnapshot({
        aggregateId: id,
        aggregate: 'trashPricing',
      }, function (error, snapshot, stream) {
        if (error) return reject(error);

        resolve({ snapshot, stream });
      })
    })
    .then(({ snapshot, stream }) => {
      const history = stream.events;
      const trashPricing = new TrashPricing();

      trashPricing.loadSnapshot(snapshot);
      trashPricing.loadFromHistory(history.map(history => history.payload));

      return trashPricing;
    });
  }

  save (trashPricing) {
    return new Promise((resolve, reject) => {
      this.es.getFromSnapshot({
        aggregateId: trashPricing.id,
        aggregate: 'trashPricing'
      }, async function (error, snapshot, stream) {
        if (error) return reject(error);

        return resolve({ snapshot, stream });
      })
    })
    .then(({ stream }) => {
      const uncommitedChanges = trashPricing.getUncommittedChanges();

      uncommitedChanges.forEach((event) => {
        stream.addEvent(event);
      });

      stream.commit();
      trashPricing.markChangesAsCommitted();

      resolve(trashPricing);
    });
  }
}
