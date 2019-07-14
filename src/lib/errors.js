import * as httpStatus from 'http-status';
import ExtendableError from 'es6-error';

/** HTTP Errors */
export class HTTPError extends ExtendableError {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class NotFoundError extends HTTPError {
  constructor(message = httpStatus.NOT_FOUND) {
    super(httpStatus['404_MESSAGE'], message);
  }
}

export class UnprocessableEntityError extends HTTPError {
  constructor(errors, message = httpStatus.UNPROCESSABLE_ENTITY) {
    super(httpStatus['422_MESSAGE'], message);
    this.errors = errors;
  }
}

/** Misc Erros */
export class EntityNotFound extends ExtendableError {}
