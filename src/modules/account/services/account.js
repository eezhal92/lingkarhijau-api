import bcrypt from 'bcrypt';
import Hashids from 'hashids';

import * as mail from '../../../lib/mail';
import { User, ResetPassword } from '../../../db/models';
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

  await ResetPassword.create({
    user: user._id,
    code,
    email,
  });

  return mail.sendMime({
    from: 'support@lingkarhijau.net',
    to: email,
    subject: 'noreply - Permintaan Ubah password',
    html: `
      <p>Halo, ${user.name}</p>
      <p>Kami menerima permintaan ubah password untuk akun yang terhubung dengan email Anda.
<a href="${process.env.FRONTEND_URL}/konfirmasi-ubah-password?code=${code}">Klik link ini</a> untuk membuat password baru</a>. Jika ini bukan dari Anda, cukup abaikan email ini.</p>
      <br>
      <p>Tim Lingkar Hijau</p>
    `
  });
}

export function findUserByResetCode(code) {
  if (!code) return Promise.reject(new Error('No user with password request found'));

  return ResetPassword.findOne({ code })
    .populate('user')
    .then((data) => {
      if (!data) return null;

      return data.user;
    });
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

  user.password = bcrypt.hashSync(payload.password, HASH_SALT);

  await user.save();
  await ResetPassword.remove({
    user: user._id,
  });

  return true;
}

export function findById(id) {
  return User.findById(id);
}

export async function activate(code) {
  const user = await User.findOne({ activationCode: code });

  if (!user) throw new AccountNotFound('Kode aktivasi tidak valid.');

  user.activationCode = null;
  user.activated = true;
  await user.save();
  await mail.sendMime({
    from: 'support@lingkarhijau.net',
    to: user.email,
    subject: 'Akun Lingkar Hijau Anda telah aktif!',
    html: `
      <p>Halo, ${user.name}</p>
      <p>Akun anda telah aktif! silakan login di melalui <a href="${process.env.FRONTEND_URL}/login">link ini</a></p>
      <br>
      <p>Tim Lingkar Hijau</p>
    `
  });

  return user;
}
