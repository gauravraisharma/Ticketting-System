using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataRepository.IRepository
{
    public interface IGeminiPromptBuilderRepository
    {
        string BuildTonePrompt(string tone, string originalHtml);
        string BuildSuggestedReplyPrompt(List<string> thread, string initiatorRole);
        string BuildPromptedMessageTransformPrompt(string originalMessage, string prompt, string tone);
        string BuildConversationSummaryPrompt(List<string> thread);
    }
}
