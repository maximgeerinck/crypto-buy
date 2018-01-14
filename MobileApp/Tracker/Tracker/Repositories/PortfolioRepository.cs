using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Tracker.Models;
using Tracker.Services;

namespace Tracker.Repositories
{
    public class PortfolioRepository
    {
        private RestService _service;

        public PortfolioRepository(HttpClient client)
        {
            _service = new RestService(client);
        }

        public async Task<Portfolio> GetPortfolio()
        {
            var coins = await _service.GetRequest<List<PortfolioCoin>>(string.Format("{0}/portfolio/load", Constants.ApiUrlBase));
            var portfolio = new Portfolio(coins);

            return portfolio;
        }
    }
}
