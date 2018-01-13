using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Tracker.Models;
using Tracker.Services;

namespace Tracker.Repositories
{
    public class AccountTokenRepository
    {
        private RestService<AccountToken> _service;

        public AccountTokenRepository(HttpClient client)
        {
            _service = new RestService<AccountToken>(client);
        }
        
        public async Task<AccountToken> LoginAccount(AccountLogin accountLogin)
        {
            AccountToken result = await _service.PostRequest(string.Format("{0}/authenticate", Constants.ApiUrlBase), accountLogin);
            return result;
        }
    }
}
