import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Hashids from 'hashids';
import { User, UserBalance } from '../../../db/models';
import { EmailIsTakenError } from '../errors';
import * as mail from '../../../lib/mail';

const HASH_SALT = 10;

function createActivationCode (email) {
  const hashids = new Hashids(email);
  const number = Number(Math.random().toString().slice(2, 18));
  return hashids.encode(number);
}

/**
 * @param {object} payload
 * @param {string} payload.email
 * @param {string} payload.password
 */
export async function findByEmailAndPassword(payload) {
  let user = await User.findOne({ email: payload.email })
    .select('id name email +password roles type phone activated');

  if (!user) return null;

  const isPasswordMatch = bcrypt.compareSync(payload.password, user.password);
  const userBalance = await UserBalance.findOne({ user: user._id });

  if (!isPasswordMatch) return null;

  let balance = 0;
  if (userBalance) balance = userBalance.balance;

  user = user.toJSON();
  delete user.password;
  user.balance =balance;

  return user;
}

/**
 * @param {import('mongoose').Model} user
 * @param {string} secret
 */
export function createToken(user, secret) {
  if (!secret) throw new Error('Invalid argument. `secret` argument needed');

  const claim = { id: user._id, email: user.email, roles: user.roles };
  return jwt.sign(claim, secret, {
    algorithm: 'HS256',
    expiresIn: '1 week'
  });
}

export function isEmailTaken(email) {
  return User.findOne({
    email
  })
    .then((data) => {
      return Boolean(data);
    });
}

/**
 * @param {object} payload
 * @param {string} payload.email
 * @param {string} payload.name
 * @param {string} payload.password
 * @param {string} payload.phone
 * @param {string} payload.type
 */
export async function register(payload) {
  const isTaken = await isEmailTaken(payload.email);

  if (isTaken) {
    throw new EmailIsTakenError('email is taken');
  }

  const data = Object.assign({}, payload, {
    password: bcrypt.hashSync(payload.password, HASH_SALT)
  });

  const activationCode = createActivationCode();

  const user = await User.create({
    ...data,
    activationCode,
  });

  await mail.sendMime({
    from: 'support@lingkarhijau.net',
    to: payload.email,
    subject: 'Selamat Datang di lingkar hijau!',
    html: `
      <p>Halo, ${user.name}</p>
      <p>Selamat datang di Lingkar Hijau. Untuk bisa memulai menggunakan aplikasi, harap untuk mengaktifkan akun anda dengan
<a href="${process.env.FRONTEND_URL}/aktivasi?code=${activationCode}">klik link ini</a>.</p>
      <br>
      <p>Tim Lingkar Hijau</p>
    `
  });

  return user;
}
