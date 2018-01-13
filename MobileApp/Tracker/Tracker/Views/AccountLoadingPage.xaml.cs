using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tracker.ViewModels;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace Tracker.Views
{
	[XamlCompilation(XamlCompilationOptions.Compile)]
	public partial class AccountLoadingPage : ContentPage
	{
        AccountLoadingViewModel viewModel;

        public AccountLoadingPage ()
		{
			InitializeComponent ();

            viewModel = new AccountLoadingViewModel();
            BindingContext = viewModel;
        }

        protected override async void OnAppearing()
        {
            base.OnAppearing();
            Debug.WriteLine("LOADING ACCOUNT");
            var result = await App.ServiceManager.AccountService.GetAccount();
            Debug.WriteLine("ACCOUNT: " + result.Email);

            if (result.Email != null)
            {
                Debug.WriteLine("Changing binding");
                viewModel.IsLoaded = "YES";
                OnPropertyChanged("IsLoaded");
            }
        }
    }
}