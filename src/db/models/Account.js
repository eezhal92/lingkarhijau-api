import { model, Schema } from 'mongoose';

const AccountSchema = Schema({
  type: {
    required: true,
    type: String,
    enum: [
      'ORGANIZATION',
      'MEMBER',
    ]
  },
  subType: {
    required: true,
    type: String,
    enum: [
      'ORGANIZATION_COMPANY',
      'ORGANIZATION_SME',
      'ORGANIZATION_GOVERNMENT',
      'MEMBER',
    ]
  },
  name: { type: String, required: true },
  address: { type: String, required: true },
  regNo: { type: String, required: true, index: true },
  phone: { type: String },
  email: { type: String },
  features: [],
  users: [
    {
      user: { type: Schema.Types.ObjectId, ref: 'User' },
      roles: [{ type: Schema.Types.ObjectId, ref: 'AccountRole' }],
    }
  ]
});

export default model('Account', AccountSchema);
