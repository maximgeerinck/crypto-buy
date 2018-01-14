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
                await Navigation.PushAsync(new AccountLoadingPage());
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
                await DisplayAlert("An error ocurred", ex.Error.Message, "");
            }
            
            await Navigation.PushAsync(new AccountLoadingPage());
        }

        async void Register_Clicked(object sender, EventArgs e)
        {
            await Navigation.PushAsync(new AccountRegisterPage());
        }
    }
}