import jwt from 'jsonwebtoken';

const AUTH_ERROR_CODES = {
  DECODE_FAILURE: 1,
  UNAUTHENTICATED: 2,
};

function getAuthToken(headers) {
  if (!headers['authorization']) return null;

  const [, token] = headers['authorization'].split('Bearer ');

  if (!token) return null;

  return token;
}

function decodeTokenPayload(token) {
  let claim = null;
  try {
    claim = jwt.decode(token, process.env.JWT_SECRET);
  } catch (error) {
    return {
      isError: true,
      error,
      errorCode: AUTH_ERROR_CODES.ERROR,
    };
  }

  if (!claim) {
    return { isError: true, errorCode: AUTH_ERROR_CODES.UNAUTHENTICATED };
  }

  const user = {
    accessMode: claim.accessMode,
    id: claim.id,
    email: claim.email,
    name: claim.name,
    accountId: claim.accountId,
    roles: claim.roles,
    permissions: claim.permissions,
  };

  return { isError: false, user };
}

export function attachUserToRequest(request, response, next) {
  const token = getAuthToken(request.headers);

  if (!token) return next();

  const result = decodeTokenPayload(token);

  if (result.user) {
    request.user = result.user;
  }

  next();
}

export function shouldAuthenticated(request, response, next) {
  if (!request.headers['authorization']) {
    return next(new Error('You are not authenticated'));
  }

  const [, token] = request.headers['authorization'].split('Bearer ');

  const result = decodeTokenPayload(token);

  if (!result.isError) {
    request.user = result.user;

    return next();
  }

  if (result.errorCode === AUTH_ERROR_CODES.UNAUTHENTICATED) {
    return next(new Error('You are not authenticated'));
  }

  return next(result.error);
}

export function createShouldAuthorized (permission) {
  return function(request, response, next) {
    // todo
  }
}
