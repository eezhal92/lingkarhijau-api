import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../../../db/models';
import { EmailIsTakenError } from '../errors';

const HASH_SALT = 10;

/**
 * @param {object} payload
 * @param {string} payload.email
 * @param {string} payload.password
 */
export async function findByEmailAndPassword(payload) {
  const user = await User.findOne({ email: payload.email })
    .select('id email +password');

  if (!user) return null;

  const isPasswordMatch = bcrypt.compareSync(payload.password, user.password);

  if (!isPasswordMatch) return null;

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

  return User.create(data);
}
