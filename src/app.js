import * as db from './db';

export default function createApp({ server }) {
  return {
    start: () => {
      Promise.resolve()
        .then(db.connect)
        .then(server.start);
    }
  }
}
