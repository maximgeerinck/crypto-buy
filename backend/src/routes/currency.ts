import CurrencyController from '../controllers/CurrencyController';

module.exports = [
  {
    method: 'GET',
    path: '/currencies/{limit}',
    handler: CurrencyController.all,
    config: { auth: false }
  },
  {
    method: 'GET',
    path: '/portfolio/load',
    handler: CurrencyController.load,
    config: { auth: false }
  },
  {
    method: 'POST',
    path: '/currency/details',
    handler: CurrencyController.details,
    config: { auth: false }
  }
];
