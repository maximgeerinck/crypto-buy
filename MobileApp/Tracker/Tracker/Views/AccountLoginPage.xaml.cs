using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tracker.Models;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace Tracker.Views
{
	[XamlCompilation(XamlCompilationOptions.Compile)]
	public partial class AccountLoginPage : ContentPage
	{
        public AccountLogin AccountLogin { get; set; }

		public AccountLoginPage()
		{
			InitializeComponent ();

            AccountLogin = new AccountLogin(); // We can only bind on the view if the object exists

            BindingContext = this;
        }

        async void Login_Clicked(object sender, EventArgs e)
        {
            // Check the account
            Debug.WriteLine("a");
            var result = await App.ServiceManager.AccountService.LoginAccount(this.AccountLogin);
            Debug.WriteLine(result.Token);

            // Say to the messaging center that we have an account login so that we can update our AI with this account
            //MessagingCenter.Send(this, "AccountLogin", Account);
            await Navigation.PopModalAsync();
        }
	}
}