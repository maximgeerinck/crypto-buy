using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tracker.Exceptions;
using Tracker.Models;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace Tracker.Views
{
	[XamlCompilation(XamlCompilationOptions.Compile)]
	public partial class AccountRegisterPage : ContentPage
    {
        public AccountRegister AccountRegister { get; set; } // Needs public for bindings

        public AccountRegisterPage ()
		{
			InitializeComponent ();
            AccountRegister = new AccountRegister(); // We can only bind on the view if the object exists
            BindingContext = this;
        }

        async void Register_Clicked(object sender, EventArgs e)
        {
            try
            {
                await App.ServiceManager.AccountService.RegisterAccount(this.AccountRegister);

                // Auto login now
                await App.ServiceManager.AccountService.LoginAccount(new AccountLogin()
                {
                    Email = this.AccountRegister.Email,
                    Password = this.AccountRegister.Password
                });
            }
            catch (APIException ex)
            {
                await DisplayAlert("An error ocurred", ex.Error.Message, "");
            }

            await Navigation.PushModalAsync(new NavigationPage(new AccountLoadingPage()));
        }
    }
}