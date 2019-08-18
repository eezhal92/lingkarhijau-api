import httpStatus from 'http-status';

import { EmailIsTakenError } from './errors';
import * as authService from './services/auth';
import { UserTypes, AccessMode } from '../../lib/rbac/constants';
import { UnprocessableEntityError } from '../../lib/errors';

/**
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 */
export async function login(request, response) {
  const { email, password, mode: accessMode } = request.body;


  let user = await authService.findUserByEmailAndPassword({ email, password });
  if (!user || !user.activated) {
    return response.status(httpStatus.NOT_FOUND).json({
      message: 'No such account',
    });
  }

  user = await authService.findUser({
    accessMode,
    id: user._id,
  });

  // check user type, based on access mode
  // if end user trying to use access mode other than 'enduser',
  // then returns 404
  if (user.type === UserTypes.EndUser && accessMode !== AccessMode.EndUser) {
    return response.status(httpStatus.NOT_FOUND).json({
      message: 'No such account',
    });
  }

  const token = authService.createToken(user, accessMode, process.env.JWT_SECRET);

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
    account,
  } = request.body;

  let user = null;

  try {
    user = await authService.register({
      email,
      password,
      name,
      phone,
      address,
      account,
      type: UserTypes.EndUser,
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
