import httpStatus from 'http-status';

import { EmailIsTakenError } from './errors';
import * as authService from './services/auth';
import { UserTypes } from '../../lib/rbac/constants';
import { UnprocessableEntityError } from '../../lib/errors';

/**
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 */
export async function login(request, response) {
  const { email, password, mode } = request.body;

  const user = await authService.findByEmailAndPassword({
    email,
    password,
  });

  if (!user || !user.activated) {
    return response.status(httpStatus.NOT_FOUND).json({
      message: 'No such account',
    });
  }

  const token = authService.createToken(user, mode, process.env.JWT_SECRET);

  return response.json({
    token,
    user
  });
}

/**
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 */
export async function register(request, response, next) {
  const {
    email,
    password,
    name,
    phone,
    address,
    accountType,
    accountSubType
  } = request.body;

  let user = null;

  try {
    user = await authService.register({
      email,
      password,
      name,
      phone,
      accountType,
      address,
      accountSubType,
      type: UserTypes.END_USER,
    });
  } catch (error) {
    if (error instanceof EmailIsTakenError) {
      return next(new UnprocessableEntityError({
        errors: {
          email: ['email ini telah digunakan oleh akun lain']
        }
      }));
    }

    return next(error);
  }

  response.json({
    user
  });
}
