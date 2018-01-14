using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Tracker.Repositories;

namespace Tracker.Services
{
    public class CoinService
    {
        private CoinRepository _repository;

        public CoinService(HttpClient client)
        {
            _repository = new CoinRepository(client);
        }

        public async Task<List<Models.Coin>> GetCoinsByIds(List<string> coinIds)
        {
            var result = await _repository.GetCoinsByIds(coinIds);
            return result;
        }
    }
}