import { model, Schema } from 'mongoose';

const UserSchema = Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, index: true },
  phone: { type: String, required: true },
  type: { type: String, required: true }, // ADMIN / USER
  password: {
    type: String, required: true, default: '', select: false
  },
  activationCode: { type: String, default: null },
  activated: { type: Boolean, default: false },
  lingkarHijauRoles: { type: Array },
  accounts: [
    {
      account: { type: Schema.Types.ObjectId, ref: 'Account' },
      roles: [{ name: String, code: String }],
    }
  ]
});

export default model('User', UserSchema);
