using System;
using System.Collections.Generic;

using Xamarin.Forms;
using Xamarin.Forms.Xaml;

using Tracker.Models;

namespace Tracker.Views
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
    public partial class NewCoinPage : ContentPage
    {
        public Coin Coin { get; set; }

        public NewCoinPage()
        {
            InitializeComponent();

            Coin = new Coin
            {
                Symbol = "SYMB",
                Name = "The coin name"
            };

            BindingContext = this;
        }

        async void Save_Clicked(object sender, EventArgs e)
        {
            MessagingCenter.Send(this, "AddCoin", Coin);
            await Navigation.PopModalAsync();
        }
    }
}