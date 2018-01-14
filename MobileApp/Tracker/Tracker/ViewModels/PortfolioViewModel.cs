using System;
using System.Collections.ObjectModel;
using System.Diagnostics;
using System.Threading.Tasks;

using Xamarin.Forms;

using Tracker.Models;
using Tracker.Views;
using System.Collections.Generic;
using System.Linq;
using Xamarin.Forms.Dynamic;

namespace Tracker.ViewModels
{
    public class PortfolioViewModel : BaseViewModel
    {
        public ObservableDictionary<string, PortfolioCoin> PortfolioCoins { get; set; }
        public ObservableCollection<Coin> Coins { get; set; }
        public Command LoadDetailsCommand { get; set; }

        public PortfolioViewModel()
        {
            Title = "Browse";
            PortfolioCoins = new ObservableDictionary<string, PortfolioCoin>();
            Coins = new ObservableCollection<Coin>();

            // Load everything in async without blocking the main thread
            LoadDetailsCommand = new Command(async () => await LoadDetails());

            //MessagingCenter.Subscribe<NewCoinPage, PortfolioCoin>(this, "AddItem", async (obj, coin) =>
            //{
            //    var _coin = coin as PortfolioCoin;
            //    PortfolioCoins.Add(_coin);
            //    await DataStore.AddItemAsync(_coin);
            //});
        }

        async Task LoadDetails()
        {
            // First get all our coins in our portfolio
            await LoadPortfolioCoins();

            // Then fetch the details for these coins
            await LoadCoins(PortfolioCoins.Keys.ToList());
        }

        /// <summary>
        /// Load our coin details based on the coins in our portfolio. Then add these details to our portfolio!
        /// This way it is accesible in the PortfolioCoin.Coin and we can access it in our bindings
        /// </summary>
        /// <param name="coinIds"></param>
        /// <returns></returns>
        async Task LoadCoins(List<string> coinIds)
        {
            if (IsBusy)
                return;

            IsBusy = true;

            try
            {
                //Coins.Clear();
                var coins = await App.ServiceManager.CoinService.GetCoinsByIds(coinIds);
                foreach (var coin in coins)
                {
                    // TODO: We do not get a render update with this, is the map correctly setting the coin? (I think so)
                    Debug.WriteLine("Adding: " + coin.Name);
                    PortfolioCoins[coin.CoinId].Coin = coin;
                    Coins.Add(coin);
                    Debug.WriteLine(PortfolioCoins[coin.CoinId].Coin.Name);
                }
                OnPropertyChanged("PortfolioCoins");
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex);
            }
            finally
            {
                IsBusy = false;
            }
        }

        async Task LoadPortfolioCoins()
        {
            if (IsBusy)
                return;

            IsBusy = true;

            try
            {
                var coins = await App.ServiceManager.PortfolioService.GetPortfolioCoins();
                foreach (var coin in coins)
                {
                    PortfolioCoins[coin.CoinId] = coin;
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex);
            }
            finally
            {
                IsBusy = false;
            }
        }
    }
}