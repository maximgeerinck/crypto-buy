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

		public AccountLoginPage()
		{
			InitializeComponent ();

            AccountLogin = new AccountLogin(); // We can only bind on the view if the object exists

            BindingContext = this;
        }

        protected override async void OnAppearing()
        {
            // If already logged in, skip and go to the next page
            if (App.ServiceManager.AccountService.IsLoggedIn())
            {
                await Navigation.PushModalAsync(new NavigationPage(new AccountLoadingPage()));
                return;
            }
        }

        async void Login_Clicked(object sender, EventArgs e)
        {
            try
            {
                await App.ServiceManager.AccountService.LoginAccount(this.AccountLogin);
            }
            catch (APIException ex)
            {
                Debug.WriteLine("API Exception"); ;
                Debug.WriteLine(@"Error: {0}", ex.Error.Error);
                Debug.WriteLine(@"Message: {0}", ex.Error.Message);
                await DisplayAlert("An error ocurred", ex.Error.Message, "");
            }
            
            await Navigation.PushModalAsync(new NavigationPage(new AccountLoadingPage()));
            //Debug.WriteLine("Found Account: " + );

            // Say to the messaging center that we have an account login so that we can update our AI with this account
            //MessagingCenter.Send(this, "AccountLogin", Account);
            //await Navigation.PopModalAsync();
        }
	}
}