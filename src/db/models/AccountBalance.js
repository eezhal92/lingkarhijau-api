import { model, Schema } from 'mongoose';

const AccountBalanceSchema = Schema({
  account: { type: Schema.Types.ObjectId, ref: 'Account', index: true },
  balance: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default model('AccountBalance', AccountBalanceSchema);
