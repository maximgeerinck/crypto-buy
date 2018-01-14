using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace Tracker.Models
{
    public class PortfolioCoin
    {
        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }

        [JsonProperty(PropertyName = "coinId")]
        public string CoinId { get; set; }

        [JsonProperty(PropertyName = "amount")]
        public double Amount { get; set; }

        [JsonProperty(PropertyName = "currency")]
        public string Currency { get; set; }

        [JsonProperty(PropertyName = "source")]
        public string Source { get; set; }

        [JsonProperty(PropertyName = "automatic")]
        public bool IsAutomatic { get; set; }

        [JsonProperty(PropertyName = "boughtPrice")]
        public double BuyPrice { get; set; }

        [JsonProperty(PropertyName = "boughtAt")]
        public DateTime BuyDate { get; set; }

        // Virtual parameter, needs to be set manually
        public Coin Coin { get; set; }
    }
}
