using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Tracker.Models;

namespace Tracker.Services
{
    public class AccountTokenService
    {
        private RestService<AccountToken> Service;

        public AccountTokenService(HttpClient client)
        {
            Service = new RestService<AccountToken>(client);
        }

        public async Task<AccountToken> LoginAccount(AccountLogin accountLogin)
        {
            AccountToken result = await Service.PostRequest(Constants.ApiUrlBase + "/authenticate", accountLogin);
            return result;
        }
    }
}
