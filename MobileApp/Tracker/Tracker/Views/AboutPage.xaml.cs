using Microcharts;
using SkiaSharp;
using System;
using System.Collections.Generic;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace Tracker.Views
{
	[XamlCompilation(XamlCompilationOptions.Compile)]
	public partial class AboutPage : ContentPage
	{
        public AboutPage ()
		{
			InitializeComponent ();
        }

        protected override void OnAppearing()
        {
            var entries = new[]
            {
                new Microcharts.Entry(212) { Label = "UWP",  ValueLabel = "212", Color = SKColor.Parse("#2c3e50") },
                new Microcharts.Entry(248) { Label = "Android",  ValueLabel = "248", Color = SKColor.Parse("#77d065") },
                new Microcharts.Entry(128) { Label = "iOS",  ValueLabel = "128", Color = SKColor.Parse("#b455b6") },
                new Microcharts.Entry(514) { Label = "Shared",  ValueLabel = "514", Color = SKColor.Parse("#3498db") },
            };
            var chart = new LineChart() { Entries = entries };

            this.chartView.Chart = chart;
        }
    }
}