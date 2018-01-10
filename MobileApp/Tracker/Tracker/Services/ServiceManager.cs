using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;

namespace Tracker.Services
{
    public class ServiceManager
    {
        // Api Endpoints
        public AccountService AccountService { get; set; }

        private HttpClient _client;

        public ServiceManager()
        {
            _client = new HttpClient();
            _client.MaxResponseContentBufferSize = 256000;
            //client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", authHeaderValue);
            
            AccountService = new AccountService(_client);
        }
    }
}
