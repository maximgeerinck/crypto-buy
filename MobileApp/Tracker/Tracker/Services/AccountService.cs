using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Tracker.Models;

namespace Tracker.Services
{
    public class AccountService
    {
        private HttpClient _client;
  
        public AccountService(HttpClient client)
        {
            _client = client;
        }
        
        public async Task<AccountToken> LoginAccount(AccountLogin accountLogin)
        {
            var accountToken = new AccountToken();
            var uri = "https://api.cryptotracker.com/authenticate";

            try
            {
                var json = JsonConvert.SerializeObject(accountLogin);
                var requestJson = new StringContent(json, Encoding.UTF8, "application/json");
                var response = await _client.PostAsync(uri, requestJson);

                Debug.WriteLine("d");
                if (response.IsSuccessStatusCode)
                {
                    var responseJson = await response.Content.ReadAsStringAsync();
                    Debug.WriteLine(responseJson);
                    accountToken = JsonConvert.DeserializeObject<AccountToken>(responseJson);
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
            }

            return accountToken;
        }

        // Note: more for get due to the ReadAsString
        // Example: http://blog.xhackers.co/httpclient-with-xamarin-forms/
        //public async Task<Account> LoginAccount(AccountLogin accountLogin)
        //{
        //    var account = new Account();
        //    var uri = "https://api.cryptotracker.com/authenticate";
        //    HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create(new Uri(uri));

        //    try
        //    {
        //        var response = await _client.GetAsync(uri);

        //        if (response.IsSuccessStatusCode)
        //        {
        //            var content = await response.Content.ReadAsStringAsync();
        //            account = JsonConvert.DeserializeObject<Account>(content);
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        Debug.WriteLine(@" ERROR {0}", ex.Message);
        //    }

        //    return account;

        //}
    }
}
