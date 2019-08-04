import * as db from './db';

export default function createApp(cradle) {
  const { server, eventstore, registerHandlers } = cradle;

  function initEventStore () {
    return new Promise((resolve) => {
      eventstore.on('connect', () => {
        console.log('[eventstore] storage connected');
      });

      eventstore.init(() => {
        console.log('[eventstore] initialized')
        resolve();
      });
    })
  }

  return {
    start: () => {
      Promise.resolve()
        .then(db.connect)
        .then(initEventStore)
        .then(registerHandlers)
        .then(server.start);
    }
  }
}
