﻿using System;
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
            var result = await App.ServiceManager.AccountService.GetAccount();

            // If we got the email, we can continue
            if (result.Email != null)
            {
                viewModel.IsLoaded = "YES";
                OnPropertyChanged("IsLoaded");
            }

            // Else I would go back to signin
            Navigation.InsertPageBefore(new AccountLoginPage(), this);
            await Navigation.PopAsync();
        }
    }
}