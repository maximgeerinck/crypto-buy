using Microcharts;
using SkiaSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Tracker.Models;

[assembly: Xamarin.Forms.Dependency(typeof(Tracker.Services.MockDataStore))]
namespace Tracker.Services
{
    public class MockDataStore : IDataStore<Coin>
    {
        List<Coin> coins;

        public MockDataStore()
        {
            // Mock chart for demo purposes
            //var entries = new[]
            //{
            //    // Note: Daily chart points, see: https://www.investing.com/currencies/btc-usd-historical-data
            //    // Started from 01-JAN
            //    new Microcharts.Entry(13354.0F) { Color = SKColor.Parse("#000000") },
            //    new Microcharts.Entry(14709.8F) { Color = SKColor.Parse("#000000") },
            //    new Microcharts.Entry(15155.0F) { Color = SKColor.Parse("#000000") },
            //    new Microcharts.Entry(15160.0F) { Color = SKColor.Parse("#000000") },
            //    new Microcharts.Entry(16917.0F) { Color = SKColor.Parse("#000000") },
            //    new Microcharts.Entry(17161.0F) { Color = SKColor.Parse("#000000") },
            //    new Microcharts.Entry(16196.0F) { Color = SKColor.Parse("#000000") },
            //    new Microcharts.Entry(14930.0F) { Color = SKColor.Parse("#000000") },
            //    new Microcharts.Entry(14505.0F) { Color = SKColor.Parse("#2c3e50") },
            //};

            var entries = new[] { 13354.0F, 14709.8F, 15155.0F, 15160.0F, 16917.0F, 17161.0F, 16196.0F, 14930.0F, 14505.0F };

            var chart = new LineChart() {
                Entries = entries.Select(d => new Entry((d - entries.Min()) / (entries.Max() - entries.Min()))
                {
                    Color = SKColor.Parse("#46768E")
                }), // Normalize the data (x - min(X)) / (max(X) - min(X))
                LineMode = LineMode.Straight,
                PointMode = PointMode.None,
                BackgroundColor = SKColors.Transparent,
                LineAreaAlpha = 20, // 0 - 255?
            };

            coins = new List<Coin>();
            var mockCoins = new List<Coin>
            {
                new Coin { Id = Guid.NewGuid().ToString(), Symbol = "BTC", Icon="btc.png", MarketCap="236,556,681,112", CirculatingSupply="16,793,625", MaxSupply="21,000,000", Name="Bitcoin", Price="$14982.5", Amount=10.269, PriceChange1D=236.09, PriceChange1DPercentage=2.2, Chart=chart },
                new Coin { Id = Guid.NewGuid().ToString(), Symbol = "ETH", Icon="eth.png", MarketCap="125,812,157,790", CirculatingSupply="96,888,887", MaxSupply="96,888,887", Name="Ethereum", Price="$1024.04", Amount=10.269, PriceChange1D=236.09, PriceChange1DPercentage=2.2, Chart=chart },
                new Coin { Id = Guid.NewGuid().ToString(), Symbol = "XRP", Icon="xrp.png", MarketCap="74,613,526,011", CirculatingSupply="38,739,142,811", MaxSupply="99,993,093,880", Name="Ripple", Price="$4.03211", Amount=10.269, PriceChange1D=236.09, PriceChange1DPercentage=2.2, Chart=chart },
                new Coin { Id = Guid.NewGuid().ToString(), Symbol = "LTC", Icon="ltc.png", MarketCap="13,080,674,567", CirculatingSupply="54,693,783", MaxSupply="84,000,000", Name="Litecoin", Price="$250.01", Amount=10.269, PriceChange1D=236.09, PriceChange1DPercentage=2.2, Chart=chart },
                new Coin { Id = Guid.NewGuid().ToString(), Symbol = "BTC", Icon="coins/btc.png", Name="Bitcoin", Price="$14982.5", Amount=10.269, PriceChange1D=236.09, PriceChange1DPercentage=2.2, Chart=chart },
                new Coin { Id = Guid.NewGuid().ToString(), Symbol = "BTC", Icon="coins/btc.png", Name="Bitcoin", Price="$14982.5", Amount=10.269, PriceChange1D=236.09, PriceChange1DPercentage=2.2, Chart=chart },
                new Coin { Id = Guid.NewGuid().ToString(), Symbol = "BTC", Icon="coins/btc.png", Name="Bitcoin", Price="$14982.5", Amount=10.269, PriceChange1D=236.09, PriceChange1DPercentage=2.2, Chart=chart },
                new Coin { Id = Guid.NewGuid().ToString(), Symbol = "BTC", Icon="coins/btc.png", Name="Bitcoin", Price="$14982.5", Amount=10.269, PriceChange1D=236.09, PriceChange1DPercentage=2.2, Chart=chart },
            };

            foreach (var coin in mockCoins)
            {
                coins.Add(coin);
            }
        }

        public async Task<bool> AddItemAsync(Coin coin)
        {
            coins.Add(coin);

            return await Task.FromResult(true);
        }

        public async Task<bool> UpdateItemAsync(Coin coin)
        {
            var _coin = coins.Where((Coin arg) => arg.Id == coin.Id).FirstOrDefault();
            coins.Remove(_coin);
            coins.Add(coin);

            return await Task.FromResult(true);
        }

        public async Task<bool> DeleteItemAsync(Coin coin)
        {
            var _coin = coins.Where((Coin arg) => arg.Id == coin.Id).FirstOrDefault();
            coins.Remove(_coin);

            return await Task.FromResult(true);
        }

        public async Task<Coin> GetItemAsync(string id)
        {
            return await Task.FromResult(coins.FirstOrDefault(s => s.Id == id));
        }

        public async Task<IEnumerable<Coin>> GetItemsAsync(bool forceRefresh = false)
        {
            return await Task.FromResult(coins);
        }
    }
}