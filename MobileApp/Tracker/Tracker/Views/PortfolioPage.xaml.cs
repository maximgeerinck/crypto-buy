using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Xamarin.Forms;
using Xamarin.Forms.Xaml;

using Tracker.Models;
using Tracker.Views;
using Tracker.ViewModels;
using Microcharts;
using SkiaSharp;

namespace Tracker.Views
{
	[XamlCompilation(XamlCompilationOptions.Compile)]
	public partial class PortfolioPage : ContentPage
	{
        PortfolioViewModel viewModel;

        public PortfolioPage()
        {
            InitializeComponent();

            BindingContext = viewModel = new PortfolioViewModel();
        }

        async void OnItemSelected(object sender, SelectedItemChangedEventArgs args)
        {
            var coin = args.SelectedItem as Coin;
            if (coin == null)
                return;

            await Navigation.PushAsync(new CoinDetailPage(new CoinDetailViewModel(coin)));

            // Manually deselect item
            CoinsListView.SelectedItem = null;
        }

        async void AddCoin_Clicked(object sender, EventArgs e)
        {
            await Navigation.PushModalAsync(new NavigationPage(new NewCoinPage()));
        }

        protected override void OnAppearing()
        {
            base.OnAppearing();

            if (viewModel.PortfolioCoins.Count() == 0)
                viewModel.LoadDetailsCommand.Execute(null);
        }
    }
}