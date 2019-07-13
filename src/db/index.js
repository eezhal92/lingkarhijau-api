import mongoose from 'mongoose';

export function connect () {
  const URI = process.env.MONGODB_URI;
  return mongoose.connect(URI, {
    useNewUrlParser: true
  });
}

export function disconnect () {
  mongoose.disconnect();
}
