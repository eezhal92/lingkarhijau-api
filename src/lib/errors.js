import * as httpStatus from 'http-status';
import ExtendableError from 'es6-error';

class HTTPError extends ExtendableError {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class UnprocessableEntityError extends HTTPError {
  constructor(errors, message = httpStatus.UNPROCESSABLE_ENTITY) {
    super(httpStatus['422_MESSAGE'], message);
    this.errors = errors;
  }
}
