using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Tracker.Models;
using Tracker.Services;

namespace Tracker.Repositories
{
    public class CoinRepository
    {
        private RestService _service;

        public CoinRepository(HttpClient client)
        {
            _service = new RestService(client);
        }

        public async Task<List<Coin>> GetCoinsByIds(List<string> coinIds)
        {
            var result = await _service.PostRequest<List<Coin>>(string.Format("{0}/coin/details", Constants.ApiUrlBase), new RequestGetCoins(coinIds));
            return result;
        }
    }
}
