using System;
using System.Collections.Generic;
using System.Text;

namespace Tracker.Models
{
    public class Portfolio
    {
        // List of my holdings
        public List<PortfolioCoin> Holdings { get; set; }

        public Portfolio(List<PortfolioCoin> holdings)
        {
            Holdings = holdings;
        }
    }
}
