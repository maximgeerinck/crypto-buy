import UserController from '../controllers/UserController';

module.exports = [
  {
    method: 'POST',
    path: '/user/create',
    handler: UserController.create,
    config: { auth: false }
  },
  {
    method: 'GET',
    path: '/user/me',
    handler: UserController.me
  },
  {
    method: 'POST',
    path: '/user/update',
    handler: UserController.update
  }
];
