import { model, Schema } from 'mongoose';

const UserBalanceSchema = Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  balance: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default model('UserBalance', UserBalanceSchema);
