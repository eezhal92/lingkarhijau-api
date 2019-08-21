import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Hashids from 'hashids';
import * as mail from '../../../lib/mail';
import { EmailIsTakenError } from '../errors';
import { User, AccountBalance, Account } from '../../../db/models';
import { AccountType, AccessMode } from '../../../lib/rbac/constants';
import { getDefaultRolesForMember, getDefaultRolesForOrg, getSystemUserRolesAndPermissions } from '../../../lib/rbac/acl';
import AccountRole from '../../../db/models/AccountRole';
import { DefaultAccountRoles } from '../../../lib/rbac/roles';
import { linkAccountUser } from '../../account/services/account';

/**
 * @param {object} user
 * @param {object} user.account
 * @param {string} user.account._id
 */
async function getEndUserRolesAndPermissions(user) {
  const userOfTheAccount = user.account.users.find(item => item.user.toString() === user._id.toString());
  const roles = await AccountRole.find({ _id: { $in: userOfTheAccount.roles } });
  const permissions = roles.reduce((acc, item) => acc.concat(item.permissions), []);

  return {
    roles: roles.map(role => role.code),
    permissions: Array.from(new Set(permissions)),
  };
}

/**
 *
 * @param {string} accessMode
 * @param {object} user
 */
export function getUserRolesAndPermissions (accessMode, user) {
  if (accessMode === AccessMode.EndUser) {
    return getEndUserRolesAndPermissions(user);
  }

  return getSystemUserRolesAndPermissions(user);
}

const HASH_SALT = 10;

function createActivationCode (email) {
  const hashids = new Hashids(email);
  const number = Number(Math.random().toString().slice(2, 18));
  return hashids.encode(number);
}

export async function findUserByEmailAndPassword({ email, password }) {
  let user = await User.findOne({ email })
    .select('id +password activated');

  if (!user) return null;

  const isPasswordMatch = bcrypt.compareSync(password, user.password);

  if (!isPasswordMatch) return null;

  return user;
}

/**
 * @param {object} payload
 * @param {string} payload.id
 * @param {string} payload.accessMode
 */
export async function findUser(payload) {
  let user = await User.findById(payload.id)
    .select('id name email roles type phone activated accounts systemRoles')
    .populate({ path: 'accounts.account' });

  if (!user) return null;

  const hasAccount = Boolean(user.accounts) && !!user.accounts.length;
  const account = hasAccount ? user.accounts[0].account : null;

  if (payload.accessMode === AccessMode.EndUser && !account) return null;

  user = user.toJSON();

  if (hasAccount) {
    const accountBalance = await AccountBalance.findOne({ account: account._id });
    user.account = account.toJSON();
    user.account.balance = accountBalance.balance;
  }

  const { roles, permissions } = await getUserRolesAndPermissions(payload.accessMode, user);

  user.roles = roles;
  user.permissions = permissions;

  delete user.password;
  delete user.accounts;
  if (payload.accessMode === AccessMode.EndUser) {
    delete user.systemRoles;
  }

  return user;
}

/**
 * @param {import('mongoose').Model} user
 * @param {string} user.account
 * @param {string} accessMode    enduser | backoffice | operator
 * @param {string} secret
 */
export function createToken(user, accessMode, secret) {
  if (!secret) throw new Error('Invalid argument. `secret` argument needed');

  const claim = {
    accessMode: accessMode,
    id: user._id,
    email: user.email,
    accountId: user.account._id,
    roles: user.roles,
    permissions: user.permissions,
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
 * @param {object} payload.account
 * @param {string} payload.account.type
 * @param {string} payload.account.subType
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
    name: data.account.name || data.name,
    phone: data.account.phone || data.phone,
    address: data.account.address || data.address,
    email: data.account.email || data.email,
    type: data.account.type,
    subType: data.account.subType,
  });

  // todo: add initial balance account balance event
  await AccountBalance.create({
    account: account._id,
    balance: 0,
  });

  // Create Roles
  let rolesMeta = [];

  if (data.account.type === AccountType.Member) {
    rolesMeta = getDefaultRolesForMember(account._id);
  } else if (data.account.type === AccountType.Organization) {
    rolesMeta = getDefaultRolesForOrg(account._id);
  }

  const roles = await Promise.all(rolesMeta.map(role => AccountRole.create(role)));
  const ownerRole = roles.find(role => role.code === DefaultAccountRoles.Owner);

  await linkAccountUser(user._id, account._id, [ownerRole._id]);

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
