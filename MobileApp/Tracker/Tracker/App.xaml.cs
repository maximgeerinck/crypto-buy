using System;
using Tracker.Services;
using Tracker.Views;
using Xamarin.Forms;

namespace Tracker
{
	public partial class App : Application
	{
        public static ServiceManager ServiceManager { get; private set; }

		public App ()
		{
			InitializeComponent();

            ServiceManager = new ServiceManager();

            // If already logged in, skip and go to the next page
            if (ServiceManager.AccountService.IsLoggedIn())
            {
                MainPage = new AccountLoadingPage();
                return;
            }

            MainPage = new AccountLoginPage();
        }

		protected override void OnStart ()
		{
			// Handle when your app starts
		}

		protected override void OnSleep ()
		{
			// Handle when your app sleeps
		}

		protected override void OnResume ()
		{
			// Handle when your app resumes
		}
	}
}
