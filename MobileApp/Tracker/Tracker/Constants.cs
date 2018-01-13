using System;
using System.Collections.Generic;
using System.Text;

namespace Tracker
{
    public static class Constants
    {
        public static string AppName = "CryptoTrackr";

        // Use ngrok internally for development to route to the api server: C:\ngrok.exe http 5000
        public static string ApiUrlBase = "http://70705abc.ngrok.io"; //https://api.cryptotracker.com;
    }
}
