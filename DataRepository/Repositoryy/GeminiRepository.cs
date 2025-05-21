using DataRepository.IRepository;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Nodes;
using System.Text.Json;
using System.Threading.Tasks;
using static DataRepository.EntityModels.GeminiRequestModel;
using static DataRepository.EntityModels.GeminiCommonModel;
using static DataRepository.EntityModels.GeminiResponseModel;
using Newtonsoft.Json;
using System.Net.Http;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Security.Cryptography.Xml;
using DataRepository.Utils;
using Azure.Core;

namespace DataRepository.Repository
{
    public class GeminiRepository:IGeminiRepository   
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;
        private readonly IGeminiPromptBuilderRepository _promptBuilder;

        public GeminiRepository(IHttpClientFactory httpClientFactory, IConfiguration configuration, IGeminiPromptBuilderRepository promptBuilder)
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
            _promptBuilder = promptBuilder;
        }
        private string GetRequestUri()
        {
            return $"{_configuration["GeminiConfig:RequestUri"]}?key={_configuration["GoogleApiKey"]}";
        }

        public async Task<TransformToneResponseModel> TransformToneAsync(ToneRequest request)
        {
            var apiKey = _configuration["GoogleApiKey"];
            var httpClient = _httpClientFactory.CreateClient();

            var prompt = _promptBuilder.BuildTonePrompt(request.Tone, request.Message);

            var geminiRequest = new
            {
                contents = new[]
                {
            new
            {
                role = "user",
                parts = new[]
                {
                    new { text = prompt }
                }
            }
        }
            };

            var requestBody = JsonConvert.SerializeObject(geminiRequest);
            var httpRequest = new HttpRequestMessage(HttpMethod.Post, GetRequestUri())
            {
                Content = new StringContent(requestBody, Encoding.UTF8, "application/json")
            };

            var response = await httpClient.SendAsync(httpRequest);
            var responseContent = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                throw new HttpRequestException($"Error from Gemini API: {response.StatusCode} - {responseContent}");
            }
            var geminiResponse = JsonConvert.DeserializeObject<GeminiResponse>(responseContent);
            var generatedText = geminiResponse?.candidates?.FirstOrDefault()?.content?.parts?.FirstOrDefault()?.text;

            return new TransformToneResponseModel
            {
                Result = generatedText ?? string.Empty
            };
        }

        public async Task<SuggestedReplyResponseModel> GetSuggestedReplyAsync(GeminiConversationRequest request)
        {
            var apiKey = _configuration["GoogleApiKey"];
            var httpClient = _httpClientFactory.CreateClient();
            var prompt = _promptBuilder.BuildSuggestedReplyPrompt(request.ConversationThread, request.InitiatorRole);

            var geminiRequest = new GeminiRequest
            {
                contents = new List<Content>
            {
                new Content
                {
                    role = "user",
                    parts = new List<Part>
                    {
                        new Part
                        {
                            text = prompt
                        }
                    }
                }
            }
            };

            var requestBody = JsonConvert.SerializeObject(geminiRequest);
            var httpRequest = new HttpRequestMessage(HttpMethod.Post, GetRequestUri())
            {
                Content = new StringContent(requestBody, Encoding.UTF8, "application/json")
            };
            var response = await httpClient.SendAsync(httpRequest);
            var content = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Gemini API error: {content}");
            }

            var geminiResponse = JsonConvert.DeserializeObject<GeminiResponse>(content);
            var reply = geminiResponse?.candidates?.FirstOrDefault()?.content?.parts?.FirstOrDefault()?.text;
            var paragraphs = reply?.Split(new[] { "\r\n", "\n", "\r" }, StringSplitOptions.RemoveEmptyEntries);
            reply = string.Join("", paragraphs.Select(p => $"<p>{p.Trim()}</p>"));

            if (string.IsNullOrWhiteSpace(reply))
            {
                throw new Exception("Gemini returned no suggestion.");
            }

            return new SuggestedReplyResponseModel
            {
               Reply= reply
            };
        }

        public async Task<TransformPromptedMessageResponseModel> TransformPromptedMessageAsync(PromptTransformRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.OriginalMessage) || string.IsNullOrWhiteSpace(request.Prompt))
            {
                return new TransformPromptedMessageResponseModel
                {
                    Success = false,
                    ErrorMessage = "Original message and prompt are required."
                };
            }

            var apiKey = _configuration["GoogleApiKey"];
            var prompt = _promptBuilder.BuildPromptedMessageTransformPrompt(request.OriginalMessage, request.Prompt, request.Tone);

            var geminiRequest = new GeminiRequest
            {
                contents = new List<Content>
            {
                new Content
                {
                    role = "user",
                    parts = new List<Part>
                    {
                        new Part { text = prompt }
                    }
                }
            }
            };

            var requestBody = JsonConvert.SerializeObject(geminiRequest);
            var client = _httpClientFactory.CreateClient();
          
            var httpRequest = new HttpRequestMessage(HttpMethod.Post, GetRequestUri())
            {
                Content = new StringContent(requestBody, Encoding.UTF8, "application/json")
            };

            try
            {
                var response = await client.SendAsync(httpRequest);
                var content = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    return new TransformPromptedMessageResponseModel
                    {
                        Success = false,
                        ErrorMessage = $"API error: {content}"
                    };
                }

                var geminiResponse = JsonConvert.DeserializeObject<GeminiResponse>(content);
                var transformed = geminiResponse?.candidates?.FirstOrDefault()?.content?.parts?.FirstOrDefault()?.text;

                transformed = Regex.Replace(transformed ?? "", @"\*\*(.*?)\*\*", "$1");

                if (string.IsNullOrWhiteSpace(transformed))
                {
                    return new TransformPromptedMessageResponseModel
                    {
                        Success = false,
                        ErrorMessage = "Gemini returned no transformed result."
                    };
                }

                return new TransformPromptedMessageResponseModel
                {
                    Success = true,
                    Result = transformed
                };
            }
            catch (Exception ex)
            {
                return new TransformPromptedMessageResponseModel
                {
                    Success = false,
                    ErrorMessage = "Something went wrong while transforming the message."
                };
            }
        }

        public async Task<string> GenerateConversationSummaryAsync(List<string> conversationLines)
        {
            var prompt = _promptBuilder.BuildConversationSummaryPrompt(conversationLines);
            var apiKey = _configuration["GoogleApiKey"];
            var httpClient = _httpClientFactory.CreateClient();
            var geminiRequest = new GeminiRequest
            {
                contents = new List<Content>
                {
            new Content
            {
                role = "user",
                parts = new List<Part>
                {
                    new Part { text = prompt }
                }
            }
        }
            };

            var requestBody = JsonConvert.SerializeObject(geminiRequest);
            var httpRequest = new HttpRequestMessage(HttpMethod.Post, GetRequestUri())
            {
                Content = new StringContent(requestBody, Encoding.UTF8, "application/json")

            };

            var response = await httpClient.SendAsync(httpRequest);
            var content = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Gemini API error: {content}");
            }

            var geminiResponse = JsonConvert.DeserializeObject<GeminiResponse>(content);
            var summary = geminiResponse?.candidates?.FirstOrDefault()?.content?.parts?.FirstOrDefault()?.text;

            if (string.IsNullOrWhiteSpace(summary))
            {
                throw new Exception("Gemini returned no summary.");
            }

            var paragraphs = summary.Split(new[] { "\r\n", "\n", "\r" }, StringSplitOptions.RemoveEmptyEntries);
            summary = string.Join("", paragraphs.Select(p => $"<p>{p.Trim()}</p>"));

            return summary;
        }


    }
}
