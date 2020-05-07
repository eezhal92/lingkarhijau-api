import * as userService from './service';

export function getUsers(request, response, next) {
  const { page, limit } = request.query;
  console.log(request.user);
  userService.getUsers({ page, limit })
    .then((data) => {
      response.json(data);
    });
}
