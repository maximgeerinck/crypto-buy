using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace Tracker.Models
{
    public class CoinPrice
    {
        [JsonProperty(PropertyName = "usd")]
        public double USD { get; set; }
    }
}
