import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Hashids from 'hashids';
import * as mail from '../../../lib/mail';
import { EmailIsTakenError } from '../errors';
import { User, AccountBalance, Account } from '../../../db/models';

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
    .select('id name email +password roles type phone activated accounts')
    .populate({ path: 'accounts.account' });

  if (!user) return null;

  const isPasswordMatch = bcrypt.compareSync(payload.password, user.password);

  const account = user.accounts[0].account;
  const accountBalance = await AccountBalance.findOne({ account: account._id });

  if (!isPasswordMatch) return null;

  let balance = 0;
  if (accountBalance) balance = accountBalance.balance;

  user = user.toJSON();
  delete user.password;
  user.balance = balance;
  user.account = account;

  return user;
}

/**
 * @param {import('mongoose').Model} user
 * @param {string} user.account
 * @param {string} mode    enduser | backoffice | operator
 * @param {string} secret
 */
export function createToken(user, mode, secret) {
  if (!secret) throw new Error('Invalid argument. `secret` argument needed');

  const claim = {
    id: user._id,
    account: user.account,
    email: user.email,
    // todo: generate lingkar hijau roles or enduser roles
    mode,
  };

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
 * @param {string} payload.address
 * @param {string} payload.accountType
 * @param {string} payload.accountSubType
 * @param {string} payload.initialBalance
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

  // create user
  const user = await User.create({
    ...data,
    activationCode,
  });

  // create account
  const account = await Account.create({
    name: data.name,
    phone: data.phone,
    address: data.address,
    email: data.email,
    type: data.accountType,
    subType: data.accountSubType,
  });

  // todo: add initial balance account balance event
  await AccountBalance.create({
    account: account._id,
    balance: data.initialBalance || 0,
  });

  // Link account and user
  user.accounts.push({ account: account._id });
  account.users.push({ user: user._id });

  await Promise.all([
    user.save(),
    account.save(),
  ]);

  mail.sendMime({
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
