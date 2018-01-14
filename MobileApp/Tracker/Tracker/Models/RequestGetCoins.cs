using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace Tracker.Models
{
    public class RequestGetCoins
    {
        [JsonProperty(PropertyName = "coins")]
        public List<string> Coins { get; set; }

        public RequestGetCoins(List<string> coinIds)
        {
            Coins = coinIds;
        }
    }
}
