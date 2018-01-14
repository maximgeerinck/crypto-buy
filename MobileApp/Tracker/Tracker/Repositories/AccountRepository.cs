using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Tracker.Models;
using Tracker.Services;

namespace Tracker.Repositories
{
    public class AccountRepository
    {
        private RestService _service;

        public AccountRepository(HttpClient client)
        {
            _service = new RestService(client);
        }

        public async Task<Account> GetAccount()
        {
            var result = await _service.GetRequest<Account>(string.Format("{0}/user/me", Constants.ApiUrlBase));
            return result;
        }

        public async Task<Account> RegisterAccount(AccountRegister accountRegister)
        {
            var result = await _service.PostRequest<Account>(string.Format("{0}/user/create", Constants.ApiUrlBase), accountRegister);
            return result;
        }
    }
}
