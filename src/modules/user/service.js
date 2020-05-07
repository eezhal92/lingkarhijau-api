import { User } from '../../db/models';

export function getUsers(payload = {}) {
  const { page = 1, limit = 10 } = payload;

  return User.paginate({}, {
    page,
    limit,
    customLabels: {
      docs: 'users',
      totalDocs: 'total'
    },
    sort: { createdAt: -1 }
  });
}
