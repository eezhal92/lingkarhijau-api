import bcrypt from 'bcrypt';
import Hashids from 'hashids';

import * as mail from '../../../lib/mail';
import { User } from '../../../db/models';
import { AccountNotFound } from '../errors';

const HASH_SALT = 10;

function createResetCode (user) {
  const hashids = new Hashids(user.email);
  const number = Number(Math.random().toString().slice(2, 18));
  return hashids.encode(number);
}

export async function requestResetPassword (email) {
  const user = await User.findOne({ email });
  const isExists = Boolean(user);

  if (!isExists) {
    throw new AccountNotFound('Akun tidak terdaftar');
  }

  const code = createResetCode(user);

  user.resetPasswordCode = code;

  await user.save()

  return mail.sendMime({
    from: 'support@lingkarhijau.net',
    to: email,
    subject: 'noreply - Permintaan Ubah password',
    html: `
      <p>Halo, ${user.name}</p>
      <p>Kami menerima permintaan ubah password untuk akun yang terhubung dengan email Anda.
<a href="${process.env.FRONTEND_URL}/ubah-password?code=${code}">Klik link ini</a> untuk membuat password baru</a>. Jika ini bukan dari Anda, cukup abaikan email ini.</p>
      <br>
      <p>Tim Lingkar Hijau</p>
    `
  });
}

export function findUserByResetCode(code) {
  if (!code) return Promise.reject(new Error('No user with password request found'));

  return User.findOne({ resetPasswordCode: code });
}

/**
 * @param {*} payload
 * @param {*} payload.code     Reset password code
 * @param {*} payload.password New password
 */
export async function saveNewPassword(payload) {
  const user = await findUserByResetCode(payload.code)
  const isCodeValid = Boolean(user);

  if (!payload.code || !isCodeValid) throw new Error('Reset password code is not valid');

  user.resetPasswordCode = null;
  user.password = bcrypt.hashSync(payload.password, HASH_SALT);

  await user.save();

  return true;
}
