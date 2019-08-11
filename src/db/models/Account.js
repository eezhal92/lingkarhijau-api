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
  phone: { type: String, required: true },
  email: { type: String },
  features: [],
  users: [
    {
      user: { type: Schema.Types.ObjectId, ref: 'User' },
      roles: [{ name: String, code: String }],
    }
  ]
});

export default model('Account', AccountSchema);
