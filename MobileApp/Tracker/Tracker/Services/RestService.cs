using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
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
                Debug.WriteLine("========== [GET START] ==========");
                Debug.WriteLine("Token: " + _client.DefaultRequestHeaders.GetValues("Authorization").First());
                Debug.WriteLine("Request Headers: " + response.RequestMessage);
                Debug.WriteLine("Uri: " + uri + " gave response: " + response);
                Debug.WriteLine("========== [GET END] ==========");

                if (response.IsSuccessStatusCode)
                {
                    var responseJson = await response.Content.ReadAsStringAsync();
                    Debug.WriteLine(responseJson);
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
                Debug.WriteLine("[APIException] " + ex.Message);
                throw ex; // Throw this one up
            }
            catch (Exception ex)
            {
                Debug.WriteLine("[EXCEPTION] " + ex.Message);

                if (ex.InnerException != null)
                {
                    Debug.WriteLine("[EXCEPTION] " + ex.InnerException.Message);
                }
            }

            return result;
        }

        public async Task<T> PostRequest(string uri, Object requestBody)
        {
            Debug.WriteLine("Loading: " + uri);
            Debug.WriteLine("Loading: " + requestBody);
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
