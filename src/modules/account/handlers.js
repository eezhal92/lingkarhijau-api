import * as httpStatus from 'http-status';
import * as accountService from './services/account';
import { AccountNotFound } from './errors';

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
