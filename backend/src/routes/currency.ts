import CurrencyController from '../controllers/CurrencyController';

module.exports = [
  {
    method: 'GET',
    path: '/currencies/latest',
    handler: CurrencyController.latest,
    config: { auth: false }
  }
];
