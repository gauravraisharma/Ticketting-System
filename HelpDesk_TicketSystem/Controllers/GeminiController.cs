using ApplicationService.IServices;
using ApplicationService.Services;
using DataRepository.EntityModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.RegularExpressions;
using static DataRepository.EntityModels.GeminiRequestModel;

namespace HelpDesk_TicketSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GeminiController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;
        private readonly IGeminiService _geminiService;
        public GeminiController(IHttpClientFactory httpClientFactory, IConfiguration configuration, HttpClient httpClient, IGeminiService geminiService)
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
            _httpClient = httpClient;
            _geminiService = geminiService;
        }

        [HttpPost("transform")]
        public async Task<IActionResult> TransformTone([FromBody] ToneRequest request)
        {
            var result = await _geminiService.TransformToneAsync(request);
            return Ok(result);
        }

        [HttpPost("suggest-reply")]
        public async Task<IActionResult> GetSuggestedReply([FromBody] GeminiConversationRequest request)
        {
            var result = await _geminiService.GetSuggestedReplyAsync(request);
            return Ok(result);
        }

        [HttpPost("transform-prompted-message")]
        public async Task<IActionResult> TransformPromptedMessage([FromBody] PromptTransformRequest request)
        {
            var result = await _geminiService.TransformPromptedMessageAsync(request);
            return Ok(result);
        }

        [HttpGet("summary/{ticketId}")]
        public async Task<IActionResult> GetConversationSummary(int ticketId)
        {
            var summary = await _geminiService.GenerateConversationSummaryAsync(ticketId);
            if (string.IsNullOrWhiteSpace(summary))
                return NotFound(new { message = "Summary could not be generated." });

            return Ok(new { summary });
        }

    }
}



