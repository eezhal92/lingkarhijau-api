import { model, Schema } from 'mongoose';

const UserSchema = Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, index: true },
  phone: { type: String, required: true },
  type: { type: String, required: true },
  resetPasswordCode: {
    type: String, default: null, select: false
  },
  password: {
    type: String, required: true, default: '', select: false
  },
  roles: { type: Array, default: [] }
});

export default model('User', UserSchema);
