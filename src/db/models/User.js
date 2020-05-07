import { model, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const UserSchema = Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, index: true },
  phone: { type: String, required: true },
  type: { type: String, required: true }, // enduser / systemuser
  password: {
    type: String, required: true, default: '', select: false
  },
  activationCode: { type: String, default: null },
  activated: { type: Boolean, default: false },
  systemRoles: { type: Array },
  accounts: [
    {
      account: { type: Schema.Types.ObjectId, ref: 'Account' },
      roles: [{ type: Schema.Types.ObjectId, ref: 'AccountRole' }],
    }
  ],
});

UserSchema.plugin(mongoosePaginate);

export default model('User', UserSchema);
