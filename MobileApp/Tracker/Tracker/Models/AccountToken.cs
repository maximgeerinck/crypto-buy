using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace Tracker.Models
{
    public class AccountToken
    {
        [JsonProperty(PropertyName = "token")]
        public string Token { get; set; }
    }
}
    