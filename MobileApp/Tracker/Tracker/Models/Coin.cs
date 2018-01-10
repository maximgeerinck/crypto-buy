using Microcharts;
using System;

namespace Tracker.Models
{
    public class Coin
    {
        public string Id { get; set; }
        public string Symbol { get; set; }
        public string Name { get; set; }
        public string Icon { get; set; }
        public double Amount { get; set; }
        public string CirculatingSupply { get; set; }
        public string MaxSupply { get; set; }
        public string MarketCap { get; set; }
        public string Price { get; set; }
        public double PriceChange1D { get; set; }
        public double PriceChange1DPercentage { get; set; }
        public Chart Chart { get; set; }
    }
}