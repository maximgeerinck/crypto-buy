using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Tracker.Repositories;

namespace Tracker.Services
{
    public class PortfolioService
    {
        private PortfolioRepository _repository;

        public PortfolioService(HttpClient client)
        {
            _repository = new PortfolioRepository(client);
        }

        public async Task<List<Models.PortfolioCoin>> GetPortfolioCoins()
        {
            var result = await _repository.GetPortfolio();
            return result.Holdings;
        }
    }
}