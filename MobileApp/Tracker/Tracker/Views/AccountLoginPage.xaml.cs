using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tracker.Exceptions;
using Tracker.Models;
using Xamarin.Auth;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace Tracker.Views
{
	[XamlCompilation(XamlCompilationOptions.Compile)]
	public partial class AccountLoginPage : ContentPage
	{
        public AccountLogin AccountLogin { get; set; } // Needs public for bindings
        private AccountStore AccountStore;
        private Xamarin.Auth.Account Account;

		public AccountLoginPage()
		{
			InitializeComponent ();

            AccountLogin = new AccountLogin(); // We can only bind on the view if the object exists
            AccountStore = AccountStore.Create();
            Account = AccountStore.FindAccountsForService(Constants.AppName).FirstOrDefault();

            BindingContext = this;
        }

        async void Login_Clicked(object sender, EventArgs e)
        {
            // Check the account
            try
            {
                var accountToken = await App.ServiceManager.AccountTokenService.LoginAccount(this.AccountLogin);
                App.ServiceManager.setAuthenticationToken(accountToken.Token); // Correctly set our token so we are authenticated
                var account = await App.ServiceManager.AccountService.GetAccount();
                Debug.WriteLine("Get email from accountservice: " + account.Email);
            }
            catch (APIException ex)
            {
                Debug.WriteLine("API Exception"); ;
                Debug.WriteLine("Error: " + ex.Error.Error);
                Debug.WriteLine("Message: " + ex.Error.Message);
                await DisplayAlert("An error ocurred", ex.Error.Message, "");
            }

            //Debug.WriteLine("Found Account: " + );

            // Say to the messaging center that we have an account login so that we can update our AI with this account
            //MessagingCenter.Send(this, "AccountLogin", Account);
            //await Navigation.PopModalAsync();
        }
	}
}