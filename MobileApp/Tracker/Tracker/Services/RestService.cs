using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Tracker.Exceptions;
using Tracker.Models;

namespace Tracker.Services
{
    public class RestService<T>
    {
        private HttpClient _client;

        public RestService(HttpClient client)
        {
            _client = client;
        }

        public async Task<T> GetRequest(string uri)
        {
            var result = default(T);

            try
            {
                var response = await _client.GetAsync(uri);

                if (response.IsSuccessStatusCode)
                {
                    var responseJson = await response.Content.ReadAsStringAsync();
                    result = JsonConvert.DeserializeObject<T>(responseJson);
                }
                else
                {
                    var responseJson = await response.Content.ReadAsStringAsync();
                    var error = JsonConvert.DeserializeObject<APIError>(responseJson);
                    throw new APIException(error);
                }
            }
            catch (APIException ex)
            {
                throw ex; // Throw this one up
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                Debug.WriteLine(ex.InnerException.Message);
            }

            return result;
        }

        public async Task<T> PostRequest(string uri, Object requestBody)
        {
            var result = default(T);

            try
            {
                var json = JsonConvert.SerializeObject(requestBody);
                Debug.WriteLine(json);
                var requestJson = new StringContent(json, Encoding.UTF8, "application/json");
                var response = await _client.PostAsync(uri, requestJson);

                if (response.IsSuccessStatusCode)
                {
                    var responseJson = await response.Content.ReadAsStringAsync();
                    result = JsonConvert.DeserializeObject<T>(responseJson);
                }
                else
                {
                    var responseJson = await response.Content.ReadAsStringAsync();
                    var error = JsonConvert.DeserializeObject<APIError>(responseJson);
                    throw new APIException(error);
                }
            }
            catch (APIException ex)
            {
                throw ex; // Throw this one up
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                Debug.WriteLine(ex.InnerException.Message);
            }

            return result;
        }

    }
}
