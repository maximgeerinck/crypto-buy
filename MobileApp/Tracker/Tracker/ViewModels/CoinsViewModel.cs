using System;
using System.Collections.ObjectModel;
using System.Diagnostics;
using System.Threading.Tasks;

using Xamarin.Forms;

using Tracker.Models;
using Tracker.Views;

namespace Tracker.ViewModels
{
    public class CoinsViewModel : BaseViewModel
    {
        public ObservableCollection<Coin> Coins { get; set; }
        public Command LoadItemsCommand { get; set; }

        public CoinsViewModel()
        {
            Title = "Browse";
            Coins = new ObservableCollection<Coin>();
            LoadItemsCommand = new Command(async () => await ExecuteLoadItemsCommand());

            MessagingCenter.Subscribe<NewCoinPage, Coin>(this, "AddItem", async (obj, coin) =>
            {
                var _coin = coin as Coin;
                Coins.Add(_coin);
                await DataStore.AddItemAsync(_coin);
            });
        }

        async Task ExecuteLoadItemsCommand()
        {
            if (IsBusy)
                return;

            IsBusy = true;

            try
            {
                Coins.Clear();
                var items = await DataStore.GetItemsAsync(true);
                foreach (var item in items)
                {
                    Coins.Add(item);
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