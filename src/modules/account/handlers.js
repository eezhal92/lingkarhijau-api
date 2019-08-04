import * as httpStatus from 'http-status';
import * as accountService from './services/account';
import { AccountNotFound } from './errors';
import { NotFoundError } from '../../lib/errors';

export async function requestResetPassword (request, response, next) {
  const { email } = request.body;

  try {
    await accountService.requestResetPassword(email);
  } catch (error) {
    if (error instanceof AccountNotFound) {
      return response.status(httpStatus.NOT_FOUND).json({
        message: error.message
      });
    }

    return next(error);
  }

  return response.json({
    message: 'We sent you email for reset password instruction'
  });
}

export async function saveNewPassword(request, response, next) {
  const { password, code } = request.body;

  try {
    await accountService.saveNewPassword({ password, code });
  } catch (error) {
    if (error instanceof AccountNotFound) {
      return next(new NotFoundError('Kode ubah password tidak valid.'));
    }
    return next(error);
  }

  return response.json({
    message: 'Thanks your new password has been saved!'
  });
}

export function getResetPasswordRequest(request, response, next) {
  const code = request.params.code;

  accountService.findUserByResetCode(code)
    .then(() => {
      response.json({
        message: 'Password request found',
      });
    })
    .catch((error) => {
      next(error);
    });
}

/**
 * Get current user information
 */
export function getMe(request, response, next) {
  accountService.getMe(request.userId)
    .then((user) => {
      if (!user) return next(new NotFoundError());

      return response.json({ user });
    })
    .catch(next);
}

export async function activate(request, response, next) {
  const code = request.body.code || 'invalid-code';

  try {
    await accountService.activate(code);
  } catch (error) {
    if (error instanceof AccountNotFound) {
      return next(new NotFoundError(error.message));
    }
  }

  return response.json({
    message: 'Akun anda berhasil di aktivasi',
  });
}

export function getTransactions(request, response) {
  return accountService.getTransactions({
    user: request.userId,
    limit: Number(request.query.limit) || 20,
    page: Number(request.query.page) || 1,
  })
    .then((data) => {
      response.json(data);
    });
}
