using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace Tracker.Models
{
    public class CoinChange
    {
        [JsonProperty(PropertyName = "percent_1h")]
        public double Percent1H { get; set; }

        [JsonProperty(PropertyName = "percent_24h")]
        public double Percent24H { get; set; }

        [JsonProperty(PropertyName = "percent_7d")]
        public double Percent7D { get; set; }
    }
}
