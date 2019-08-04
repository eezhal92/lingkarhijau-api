import Queue from 'bull';

export class UserBalanceQueue {
  constructor () {
    this.queue = new Queue('lingkarhijau.user_balance', process.env.REDIS_URL);
    this.register = this.register.bind(this);
    this.push = this.push.bind(this);
  }

  register(handler) {
    this.queue.process((job, done) => {
      const event = job.data;
      handler(event)
        .then(done);
    });
  }

  push(event) {
    this.queue.add(event);
  }
}
