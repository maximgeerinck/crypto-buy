using Microcharts;
using SkiaSharp;
using System;
using System.Collections.Generic;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace Tracker.Views
{
	[XamlCompilation(XamlCompilationOptions.Compile)]
	public partial class AboutPage : ContentPage
	{
        public AboutPage ()
		{
			InitializeComponent ();
        }

        private void Logout_Clicked(object sender, EventArgs e)
        {
            App.ServiceManager.AccountService.Logout();
            App.Current.MainPage = new AccountLoginPage();
        }
    }
}