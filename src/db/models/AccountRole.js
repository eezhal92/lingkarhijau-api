import { model, Schema } from 'mongoose';

const AccountRoleSchema = Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  account: { type: Schema.Types.ObjectId, ref: 'Account' },
  revokable: { type: Boolean, required: true },
  permissions: { type: Array },
});

export default model('AccountRole', AccountRoleSchema);
