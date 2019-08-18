import bcrypt from 'bcrypt';
import Hashids from 'hashids';

import * as mail from '../../../lib/mail';
import {
  User,
  Account,
  AccountBalance,
  ResetPassword,
  Transaction,
} from '../../../db/models';
import { AccountNotFound } from '../errors';
import { findUser } from '../../auth/services/auth';

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
  if (!code) return Promise.reject(new AccountNotFound('No user with password request found'));

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

  if (!payload.code || !isCodeValid) throw new AccountNotFound('Reset password code is not valid');

  user.password = bcrypt.hashSync(payload.password, HASH_SALT);

  await user.save();
  await ResetPassword.remove({
    user: user._id,
  });

  return true;
}

export async function getMe({ userId, accessMode } = {}) {
  return findUser({ id: userId, accessMode });
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

/**
 * @param {object} options
 * @param {number} options.page
 * @param {number} options.limit
 * @param {string} options.user
 */
export function getTransactions (options) {
  const { limit, page, account } = options;
  return Transaction.paginate({
    account,
  }, {
    limit,
    page,
    customLabels: {
      docs: 'items',
      totalDocs: 'total'
    },
    sort: { createdAt: -1 }
  });
}

/**
 * Create new account. Account could not be linked to specific user
 * Like primary school kids, grandma grandpa etc
 * @param  {object} payload
 * @return {string} payload.type
 * @return {string} payload.subType
 * @return {string} payload.name
 * @return {string} payload.address
 * @return {string} payload.phone
 * @return {string} payload.email
 */
export async function createAccount(payload) {
  const account = await Account.create(payload);
  await AccountBalance.create({
    account: account._id,
    balance: 0,
  });
}

async function getAccountUser(userId, accountId) {
  const user = await User.findById(userId);
  const account = await Account.findById(accountId);
  const isUserLinkedToAccount = account.users.map(item => item.user)
    .includes(userId);
  const isAccountLinkedToUser = user.accounts.map(item => item.account)
    .includes(accountId);
  const isLinked = isUserLinkedToAccount && isAccountLinkedToUser;

  return {
    isLinked,
    user,
    account,
  }
}

export async function linkAccountUser(userId, accountId, roles) {
  const { isLinked, user, account } = await getAccountUser(userId, accountId);

  if (!isLinked) {
    user.accounts.push({ account: accountId, roles });
    account.users.push({ user: userId, roles });

    return Promise.all([
      user.save(),
      account.save(),
    ]);
  }

  return Promise.resolve([]);
}

export async function unlinkAccountUser(userId, accountId, roles) {
  const { isLinked, user, account } = await getAccountUser(userId, accountId);

  if (isLinked) {
    user.accounts = user.accounts.filter(item => item.account !== accountId);
    account.users = account.users.filter(item => item.user !== userId);

    return Promise.all([
      user.save(),
      account.save(),
    ]);
  }

  return Promise.resolve([]);
}

export async function addRole(userId, accountId, role) {
  const { isLinked, user, account } = await getAccountUser(userId, accountId);

  if (!isLinked) return;

  const userAccount = user.accounts.find(item => item.account === accountId);
  const accountUser = account.users.find(item => item.user === userId);

  if (!userAccount.roles.includes(role)) userAccount.roles.push(role);
  if (!accountUser.roles.includes(role)) accountUser.roles.push(role);

  return Promise.all([
    user.save(),
    account.save(),
  ]);
}

export async function removeRole(userId, accountId, role) {
  const { isLinked, user, account } = await getAccountUser(userId, accountId);

  if (!isLinked) return;

  const userAccount = user.accounts.find(item => item.account === accountId);
  const accountUser = account.users.find(item => item.user === userId);

  userAccount.roles = userAccount.roles.filter(_role => _role !== role);
  accountUser.roles = accountUser.roles.filter(_role => _role !== role);

  return Promise.all([
    user.save(),
    account.save(),
  ]);
}
