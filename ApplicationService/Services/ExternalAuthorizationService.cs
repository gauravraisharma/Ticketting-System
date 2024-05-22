using ApplicationService.Constants;
using ApplicationService.IServices;
using Azure;
using Azure.Core;
using DataRepository.EntityModels;
using DataRepository.IRepository;
using Jose;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.ComponentModel.Design;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography.Xml;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationService.Services
{
    public class ExternalAuthorizationService : IExternalAuthorizationService
    {
        private readonly IExternalAuthorizationRepository _externalAuthorizationRepository;
        public ExternalAuthorizationService(IExternalAuthorizationRepository externalAuthorizationRepository)
        {
            _externalAuthorizationRepository = externalAuthorizationRepository;
        }
        public async Task<LoginStatus> ConnectWithClient(ConnectWithClientRequest clientRequest)
        {

            ConnectWithClientBLLModel clientModel = new ConnectWithClientBLLModel()
            {
                ApplicationName = clientRequest.ApplicationName,
            };
            
                var response = await _externalAuthorizationRepository.ConnectWithClient(clientModel);

                var decryptedToken = JWT.Decode(clientRequest.CipherText, Convert.FromBase64String(response.ClientSecretKey));

                CipherDataModel cipherDataModel = JsonConvert.DeserializeObject<CipherDataModel>(decryptedToken);


                // Fetch the values
                string email = cipherDataModel.Email;
                DateTime sessionStartTime = DateTime.Parse(cipherDataModel.SessionStartTime.ToString());

                //Session Validation
                if (DateTime.UtcNow - sessionStartTime > TimeSpan.FromMinutes(5))
                {
                    // Session start time exceeded five minutes
                    return new LoginStatus { Status = "FAILED", Message = "Time limit exceeded." };
                }


                // Validate endpointUrl existence in the database
                if (response.ApplicationURL != null && response.ApplicationURL != clientRequest.ClientHostURL)
                {
                    // host url does not exist in the database
                    return new LoginStatus { Status = "FAILED", Message = "Endpoint URL not found in the database." };
                }

                var userFound = await _externalAuthorizationRepository.IsUserFound(email);
                if (userFound != null)
                {
                    var loginResponse = await _externalAuthorizationRepository.AuthenticateExternalUser(userFound.Email, clientRequest.ApplicationName);
                    if (loginResponse.Status == "SUCCEED")
                    {
                        var decryptToken = JWT.Decode(loginResponse.AccessToken, Convert.FromBase64String(response.ClientSecretKey));
                        CipherUserDataModel cipherUserDataModel = JsonConvert.DeserializeObject<CipherUserDataModel>(decryptToken);
                        var expUnix = long.Parse(cipherUserDataModel.Exp);
                        var expDateTime = DateTimeOffset.FromUnixTimeSeconds(expUnix).UtcDateTime;
                        if (expDateTime < DateTime.UtcNow)
                        {
                            // Token Expired, refresh token
                            var refreshTokenResponse =  await CallbackRequestToClient(response.APIEndpoint, loginResponse.RefreshToken, response.ClientSecretKey, clientRequest.ApplicationName, TokenConstants.RefreshToken);
                            return refreshTokenResponse;
                        }
                        else
                        {
                            return loginResponse;
                        }
                    }
                    else
                    {
                        return new LoginStatus { Status = "FAILED", Message = "Authentication failed." };
                    }
                }
                else
                {
                    var loginResponse = await CallbackRequestToClient(response.APIEndpoint, clientRequest.CipherText, response.ClientSecretKey, clientRequest.ApplicationName, TokenConstants.GenerateToken);
                    return loginResponse;
                }
            }
       
            private async Task<ExternalLoginStatus> CallbackRequestToClient(string endpointUrl, string token, string clientSecretKey, string applicationName, string tokenType)
            {
                try
                {

                    using (var httpClient = new HttpClient())
                    {
                    httpClient.BaseAddress = new Uri(endpointUrl);
                    httpClient.DefaultRequestHeaders.Clear();

                    ClientUserDataRequest clientUserDataRequest = new ClientUserDataRequest()
                    {
                        Token = token,
                        Type = tokenType,
                    };
                    string jsonData = JsonConvert.SerializeObject(clientUserDataRequest);
                    var content = new StringContent(jsonData, Encoding.UTF8, "application/json");

                    HttpResponseMessage httpResponse = await httpClient.PostAsync("",content);

                        if (httpResponse.IsSuccessStatusCode)
                    {
                        var responseBody = await httpResponse.Content.ReadAsStringAsync();
                        CipherClientResponse cipherClientResponse = JsonConvert.DeserializeObject<CipherClientResponse>(responseBody);
                        string responseStatus = cipherClientResponse.Status;
                        string accessToken = responseStatus == "SUCCEED" ? cipherClientResponse.AccessToken : "";
                        string refreshToken = responseStatus == "SUCCEED" ? cipherClientResponse.RefreshToken : "";

                        if (accessToken == null)
                        {
                            return new ExternalLoginStatus { Status = "FAILED", Message = "No data found" };
                        }

                        var decryptToken = JWT.Decode(accessToken, Convert.FromBase64String(clientSecretKey));
                        CipherUserDataModel cipherUserDataModel = JsonConvert.DeserializeObject<CipherUserDataModel>(decryptToken);
                        var tokenres = await _externalAuthorizationRepository.SaveExternalTokens(cipherUserDataModel.Email, applicationName, accessToken, refreshToken);

                        var userFound = await _externalAuthorizationRepository.IsUserFound(cipherUserDataModel.Email);
                        if (userFound != null)
                        {
                            var loginResponse = await _externalAuthorizationRepository.AuthenticateExternalUser(userFound.Email, applicationName);
                            return loginResponse;
                        }
                        else
                        {
                            var loginResponse = await _externalAuthorizationRepository.RegisterExternalUser(cipherUserDataModel, cipherClientResponse.AccessToken, cipherClientResponse.RefreshToken, applicationName);
                            return loginResponse;
                        }
                    }
                    else
                    {
                        return new ExternalLoginStatus { Status = "FAILED", Message = "Failed to connect with Client." };
                    }
                }
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine($"Error in CallbackRequestToClient: {ex.Message}");
                return new ExternalLoginStatus { Status = "FAILED", Message = "An error occurred" };
            }
        }

    }
}

