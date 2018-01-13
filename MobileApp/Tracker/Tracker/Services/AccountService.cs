using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Tracker.Exceptions;
using Tracker.Models;
using Tracker.Repositories;
using Xamarin.Auth;

namespace Tracker.Services
{
    public class AccountService
    {
        private AccountStore AccountStore;
        private AccountRepository _accountRepository;
        private AccountTokenRepository _accountTokenRepository;
        private Xamarin.Auth.Account XamarinAccount;

        public AccountService(HttpClient client)
        {
            _accountRepository = new AccountRepository(client);
            _accountTokenRepository = new AccountTokenRepository(client);

            AccountStore = AccountStore.Create();
            XamarinAccount = AccountStore.FindAccountsForService(Constants.AppName).FirstOrDefault();
        }

        public async Task<Models.Account> LoginAccount(AccountLogin login)
        {
            var accountToken = await _accountTokenRepository.LoginAccount(login);
            Debug.WriteLine("Get token from accountservice: " + accountToken.Token);

            // Set our logged in token
            App.ServiceManager.setAuthenticationToken(accountToken.Token); // Correctly set our token so we are authenticated
            var account = await _accountRepository.GetAccount();

            // If we found the old account, remove it with the new logged in one
            if (XamarinAccount != null)
            {
                AccountStore.Delete(XamarinAccount, Constants.AppName);
            }

            // Save the account token so we can login again later
            var xamarinAccount = new Xamarin.Auth.Account(account.Email);
            xamarinAccount.Properties.Add("Token", accountToken.Token);
            await AccountStore.SaveAsync(xamarinAccount, Constants.AppName);

            return account;
        }

        public async Task<Models.Account> GetAccount()
        {
            var result = await this._accountRepository.GetAccount();
            return result;
        }

        public Boolean IsLoggedIn()
        {
            if (XamarinAccount == null)
            {
                return false;
            }

            if (XamarinAccount.Properties.ContainsKey("Token") && XamarinAccount.Properties["Token"] != null && !XamarinAccount.Properties["Token"].Equals(""))
            {
                App.ServiceManager.setAuthenticationToken(XamarinAccount.Properties["Token"]); // Correctly set our token so we are authenticated
                return true;
            }

            return false;
        }
    }
}
