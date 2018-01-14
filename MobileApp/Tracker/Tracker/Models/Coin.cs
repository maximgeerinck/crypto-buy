using Microcharts;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace Tracker.Models
{
    public class Coin
    {
        [JsonProperty(PropertyName = "_id")]
        public string Id { get; set; }

        [JsonProperty(PropertyName = "coin_id")]
        public string CoinId { get; set; }

        [JsonProperty(PropertyName = "name")]
        public string Name { get; set; }

        [JsonProperty(PropertyName = "symbol")]
        public string Symbol { get; set; }

        [JsonProperty(PropertyName = "rank")]
        public double Rank { get; set; }

        [JsonProperty(PropertyName = "history")]
        public List<CoinHistoryTick> History { get; set; }

        [JsonProperty(PropertyName = "change")]
        public CoinChange Change { get; set; }

        [JsonProperty(PropertyName = "price")]
        public CoinPrice Price { get; set; }

        public Coin()
        {

        }

        public Coin(string name)
        {

        }
    }
}