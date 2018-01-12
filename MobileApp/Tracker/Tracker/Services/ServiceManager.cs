using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;

namespace Tracker.Services
{
    public class ServiceManager
    {
        // Api Endpoints
        public Boolean IsAuthenticated { get; private set; }
        public AccountService AccountService { get; set; }
        public AccountTokenService AccountTokenService { get; set; }
        
        private HttpClient _client;

        public ServiceManager()
        {
            _client = new HttpClient();
            _client.MaxResponseContentBufferSize = 256000;
            //client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", authHeaderValue);

            IsAuthenticated = false;

            AccountTokenService = new AccountTokenService(_client);
            AccountService = new AccountService(_client);
        }

        public void setAuthenticationToken(string token)
        {
            IsAuthenticated = true;
            _client.DefaultRequestHeaders.Add("Authorization", token);
        }
    }
}
