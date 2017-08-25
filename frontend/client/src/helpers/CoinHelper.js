export const getCoinImage = name =>
  `https://files.coinmarketcap.com/static/img/coins/32x32/${name.toLowerCase().replace(/[. ]/, '-')}.png`;
