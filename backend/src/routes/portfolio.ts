import PortfolioController from '../controllers/PortfolioController';

module.exports = [
  {
    method: 'GET',
    path: '/portfolio/load',
    handler: PortfolioController.index
  },
  {
    method: 'POST',
    path: '/portfolio/coins/add',
    handler: PortfolioController.addCoins
  },
  {
    method: 'POST',
    path: '/portfolio/coin/update',
    handler: PortfolioController.updateCoin
  },
  {
    method: 'POST',
    path: '/portfolio/coin/remove',
    handler: PortfolioController.removeCoin
  }
];
