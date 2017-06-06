import CurrencyController from '../controllers/CurrencyController';

module.exports = [
    {
        method: 'GET',
        path: '/currencies/{limit}',
        handler: CurrencyController.all,
        config: { auth: false }
    }
];