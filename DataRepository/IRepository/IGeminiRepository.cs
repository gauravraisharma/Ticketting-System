using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static DataRepository.EntityModels.GeminiRequestModel;
using static DataRepository.EntityModels.GeminiResponseModel;

namespace DataRepository.IRepository
{
    public interface IGeminiRepository
    {
        Task<TransformToneResponseModel> TransformToneAsync(ToneRequest request);
        Task<SuggestedReplyResponseModel> GetSuggestedReplyAsync(GeminiConversationRequest request);
        Task<TransformPromptedMessageResponseModel> TransformPromptedMessageAsync(PromptTransformRequest request);
        Task<string> GenerateConversationSummaryAsync(List<string> conversationLines);

    }

}
