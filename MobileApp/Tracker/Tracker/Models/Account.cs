using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace Tracker.Models
{
    public class Account
    {
        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }

        [JsonProperty(PropertyName = "email")]
        public string Email { get; set; }

        [JsonProperty(PropertyName = "enabled")]
        public string Enabled { get; set; }

        [JsonProperty(PropertyName = "expired")]
        public string Expired { get; set; }

        [JsonProperty(PropertyName = "token")]
        public string Token { get; set; }
        //public AccountPortfolio Portfolio { get; set; }
        //public AccountPreference Preferences { get; set; }
        //public Share[] Shares { get; set; }
        //public AccountHistory History { get; set; }

        [JsonProperty(PropertyName = "updatedOn")]
        public string UpdatedOn { get; set; }

        [JsonProperty(PropertyName = "createdOn")]
        public string CreatedOn { get; set; }
    }
}
