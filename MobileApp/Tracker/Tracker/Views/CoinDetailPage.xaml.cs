using System;

using Xamarin.Forms;
using Xamarin.Forms.Xaml;

using Tracker.Models;
using Tracker.ViewModels;

namespace Tracker.Views
{
	[XamlCompilation(XamlCompilationOptions.Compile)]
	public partial class CoinDetailPage : ContentPage
	{
        CoinDetailViewModel viewModel;

        public CoinDetailPage(CoinDetailViewModel viewModel)
        {
            InitializeComponent();
            
            BindingContext = this.viewModel = viewModel;
        }

        public CoinDetailPage()
        {
            InitializeComponent();

            var coin = new Coin
            {
                Symbol = "BTCadwadaw",
                Name = "Bitcoin"
            };

            viewModel = new CoinDetailViewModel(coin);
            BindingContext = viewModel;
        }
    }
}