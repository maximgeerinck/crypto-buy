using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Tracker.Exceptions;
using Tracker.Models;

namespace Tracker.Services
{
    public class AccountService
    {
        private RestService<Account> _service;
  
        public AccountService(HttpClient client)
        {
            _service = new RestService<Account>(client);
        }

        public async Task<Account> GetAccount()
        {
            var result = await _service.GetRequest(Constants.ApiUrlBase + "/me");
            return result;
        }
    }
}
