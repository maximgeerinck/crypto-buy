using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Tracker.Models;
using Tracker.Repositories;

namespace Tracker.Services
{
    public class AccountTokenService
    {
        public AccountTokenRepository Repository { get; set; }

        public AccountTokenService(HttpClient client)
        {
            Repository = new AccountTokenRepository(client);
        }
    }
}
