using System;
using System.Collections.Generic;
using System.Text;
using System.Windows.Input;
using Xamarin.Forms;

namespace Tracker.ViewModels
{
    public class AccountLoadingViewModel : BaseViewModel
    {
        string isLoaded = "";
        public string IsLoaded
        {
            get { return isLoaded; }
            set { SetProperty(ref isLoaded, value); }
        }

        public AccountLoadingViewModel()
        {
            Title = "Account Loading";
        }
    }
}
