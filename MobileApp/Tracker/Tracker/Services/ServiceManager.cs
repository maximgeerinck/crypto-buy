﻿using System;
using System.Collections.Generic;
using System.Diagnostics;
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
        public PortfolioService PortfolioService { get; set; }
        public CoinService CoinService { get; set; }

        private HttpClient _client;

        public ServiceManager()
        {
            _client = new HttpClient();
            _client.MaxResponseContentBufferSize = 256000;
            //client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", authHeaderValue);

            IsAuthenticated = false;

            AccountTokenService = new AccountTokenService(_client);
            AccountService = new AccountService(_client);
            PortfolioService = new PortfolioService(_client);
            CoinService = new CoinService(_client);
        }

        public void setAuthenticationToken(string token)
        {
            Debug.WriteLine("Setting token: " + token);
            IsAuthenticated = true;

            // First remove it (since we Add it and could end up having duplicates)
            _client.DefaultRequestHeaders.Remove("Authorization");
            _client.DefaultRequestHeaders.Remove("authorization");

            // Then add it
            _client.DefaultRequestHeaders.TryAddWithoutValidation("Authorization", token);
        }
    }
}
