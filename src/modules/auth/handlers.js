import httpStatus from 'http-status';

import { EmailIsTakenError } from './errors';
import * as authService from './services/auth';
import { Roles } from '../../lib/rbac/constants';

/**
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 */
export async function login(request, response) {
  const { email, password } = request.body;

  const user = await authService.findByEmailAndPassword({
    email,
    password,
  });

  if (!user) {
    return response.status(httpStatus.NOT_FOUND).json({
      message: 'No such account',
    });
  }

  const token = authService.createToken(user, process.env.JWT_SECRET);

  return response.json({
    token,
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
    phone
  } = request.body;

  let user = null;

  try {
    user = await authService.register({
      email,
      password,
      name,
      phone,
      type: Roles.MEMBER,
    })
  } catch (error) {
    if (error instanceof EmailIsTakenError) {
      return response.status(400).json({
        message: error.message,
      })
    }

    return next(error);
  }

  response.json({
    user
  });
}
