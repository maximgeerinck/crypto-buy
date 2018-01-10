using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.Net;
using Tracker.Models;
using System.Net.Http;
using Newtonsoft.Json;
using System.Diagnostics;

namespace Tracker.API
{
    public class AccountService
    {
        private HttpClient _client;

        public AccountService(HttpClient client)
        {
            _client = client;
        }

        public async Task<Account> LoginAccount(AccountLogin accountLogin)
        {
            var account = new Account();
            var uri = "https://api.cryptotracker.com/authenticate";
            HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create(new Uri(uri));

            try
            {
                var json = JsonConvert.SerializeObject(accountLogin);
                var requestJson = new StringContent(json, Encoding.UTF8, "application/json");
                var response = await _client.PostAsync(uri, requestJson);

                if (response.IsSuccessStatusCode)
                {
                    var responseJson = await response.Content.ReadAsStringAsync();
                    Console.WriteLine(responseJson);
                    account = JsonConvert.DeserializeObject<Account>(responseJson);
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine(@" ERROR {0}", ex.Message);
            }

            return account;

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
