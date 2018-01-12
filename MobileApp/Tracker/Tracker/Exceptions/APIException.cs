using System;
using System.Collections.Generic;
using System.Text;
using Tracker.Models;

namespace Tracker.Exceptions
{
    public class APIException : Exception
    {
        public APIError Error { get; private set; }

        public APIException()
        {
            Error = new APIError();
        }

        public APIException(string message) : base(message)
        {
            Error = new APIError(message);
        }

        public APIException(APIError error) : base(error.Message)
        {
            Error = error;
        }

        public APIException(string message, Exception inner) : base(message, inner)
        {
            Error = new APIError(message);
        }
    }
}