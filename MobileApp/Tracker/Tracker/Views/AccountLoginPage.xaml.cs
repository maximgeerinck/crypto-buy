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

            // We do not want to let the user use the back button to come on the Login page
            // Therefor we set a different root page
            // In a normal navigation we would use await Navigation.PushAsync(new AccountLoadingPage());
            App.Current.MainPage = new AccountLoadingPage();
        }

        async void Register_Clicked(object sender, EventArgs e)
        {
            // We also insert the register in the root, since we automatically log in!
            App.Current.MainPage = new AccountRegisterPage();
        }
    }
}