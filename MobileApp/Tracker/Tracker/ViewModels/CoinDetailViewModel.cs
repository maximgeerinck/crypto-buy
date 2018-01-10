using System;

using Tracker.Models;

namespace Tracker.ViewModels
{
    public class CoinDetailViewModel : BaseViewModel
    {
        public Coin Coin { get; set; }
        public CoinDetailViewModel(Coin coin = null)
        {
            Title = coin?.Name;
            Coin = coin;
        }
    }
}
