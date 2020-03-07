import mongoose from 'mongoose';

// https://stackoverflow.com/questions/30909492/mongoerror-topology-was-destroyed
export function connect () {
  const URI = process.env.MONGODB_URI;
  return mongoose.connect(URI, {
    useNewUrlParser: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000,
  });
}

export function disconnect () {
  mongoose.disconnect();
}
