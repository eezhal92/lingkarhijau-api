import jwt from 'jsonwebtoken';

export function shouldAuthenticated(request, response, next) {
  if (!request.headers['authorization']) {
    return next(new Error('You are not authenticated'));
  }

  const [, token] = request.headers['authorization'].split('Bearer ');

  let claim = null;
  try {
    claim = jwt.decode(token, process.env.JWT_SECRET);
  } catch (error) {
    return next(error);
  }

  if (!claim) {
    return next(new Error('You are not authenticated'));
  }

  request.user = {
    accessMode: claim.accessMode,
    id: claim.id,
    email: claim.email,
    name: claim.name,
    accountId: claim.accountId,
    roles: claim.roles,
    permissions: claim.permissions,
  };

  return next();
}

export function createShouldAuthorized (permission) {
  return function(request, response, next) {

  }
}
