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
	public partial class CoinsPage : ContentPage
	{
        CoinsViewModel viewModel;

        public CoinsPage()
        {
            InitializeComponent();

            BindingContext = viewModel = new CoinsViewModel();
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

            if (viewModel.Coins.Count == 0)
                viewModel.LoadItemsCommand.Execute(null);
        }
    }
}