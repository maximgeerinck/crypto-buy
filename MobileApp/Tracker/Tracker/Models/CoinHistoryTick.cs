using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace Tracker.Models
{
    public class CoinHistoryTick
    {
        [JsonProperty(PropertyName = "price")]
        public double Price { get; set; }
    }
}
