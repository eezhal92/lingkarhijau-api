import Validator from 'validatorjs';
import { UnprocessableEntityError } from '../lib/errors';

export function createShouldValidated(rules) {
  return function shouldValidated(request, response, next) {
    const data = request.body;
    const validation = new Validator(data, rules, {
      required: ':attribute harus diisi'
    });

    if (validation.fails()) {
      return next(new UnprocessableEntityError(validation.errors));
    }

    return next();
  }
}
