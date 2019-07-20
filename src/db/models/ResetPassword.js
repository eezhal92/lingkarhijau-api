import { model, Schema } from 'mongoose';

const ResetPasswordSchema = Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  email: { type: String, required: true },
  code: {
    type: String, default: null, select: false
  },
});

export default model('ResetPassword', ResetPasswordSchema);
