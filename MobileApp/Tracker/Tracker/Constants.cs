using System;
using System.Collections.Generic;
using System.Text;

namespace Tracker
{
    public static class Constants
    {
        public static string AppName = "CryptoTrackr";

        // Use ngrok internally for development to route to the api server: C:\ngrok.exe http 5000
        public static string ApiUrlBase = "http://16d15838.ngrok.io"; //https://api.cryptotracker.com;

        // Note: More login providers demo: https://github.com/xamarin/xamarin-forms-samples/blob/c0c2c339340245bc0d8b5f6d52c3b9b7349e4042/WebServices/TodoAWSAuth/TodoAWS/Constants.cs
    }
}
