import { model, Schema } from 'mongoose';

const UserSchema = Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, index: true },
  phone: { type: String, required: true },
  type: { type: String, required: true },
  password: {
    type: String, required: true, default: '', select: false
  },
  activationCode: { type: String, default: null },
  activated: { type: Boolean, default: false },
  roles: { type: Array, default: [] }
});

export default model('User', UserSchema);
