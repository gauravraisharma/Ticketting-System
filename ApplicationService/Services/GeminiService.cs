using ApplicationService.IServices;
using DataRepository.IRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static DataRepository.EntityModels.GeminiRequestModel;
using static DataRepository.EntityModels.GeminiResponseModel;

namespace ApplicationService.Services
{
    public class GeminiService:IGeminiService
    {
        private readonly IGeminiRepository _geminiRepository;
        private readonly ITicketService _ticketService;

        public GeminiService(IGeminiRepository geminiRepository, ITicketService ticketService)
        {
            _geminiRepository = geminiRepository;
            _ticketService = ticketService;
        }

        public async Task<TransformToneResponseModel> TransformToneAsync(ToneRequest request)
        {
            return await _geminiRepository.TransformToneAsync(request);
        }

        public async Task<SuggestedReplyResponseModel> GetSuggestedReplyAsync(GeminiConversationRequest request)
        {
            return await _geminiRepository.GetSuggestedReplyAsync(request);
        }

        public async Task<TransformPromptedMessageResponseModel> TransformPromptedMessageAsync(PromptTransformRequest request)
        {
            return await _geminiRepository.TransformPromptedMessageAsync(request);
        }
        public async Task<string> GenerateConversationSummaryAsync(int ticketId)
        {
            var ticketData = await _ticketService.GetTicketDataById(ticketId);
            if (ticketData == null || ticketData.TicketDetail == null)
                return null;

            var conversationLines = new List<string>
    {
        $"User: {StripHtml(ticketData.TicketDetail.Description)}"
    };

            foreach (var convo in ticketData.conversationDetailList.OrderBy(c => c.CreatedOn))
            {
                var role = string.IsNullOrEmpty(convo.UserType) ? "User" : convo.UserType;
                conversationLines.Add($"{role}: {StripHtml(convo.Message)}");
            }

            return await _geminiRepository.GenerateConversationSummaryAsync(conversationLines);
        }

        private string StripHtml(string input)
        {
            if (string.IsNullOrWhiteSpace(input))
                return string.Empty;

            return System.Text.RegularExpressions.Regex.Replace(input, "<.*?>", string.Empty);
        }

    }
}
