using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataRepository.Utils
{
    public static class GeminiPromptBuilder
    {
        public static string BuildTonePrompt(string tone, string originalHtml)
        {
            var sb = new StringBuilder();

            sb.AppendLine("You are a helpful assistant that rewrites the visible text content inside an HTML string into a specified tone (formal, casual, funny, or direct).");
            sb.AppendLine();
            sb.AppendLine("🛑 IMPORTANT:");
            sb.AppendLine("- Do NOT remove or alter any HTML tags (like <strong>, <i>, <p>, <br>, etc.).");
            sb.AppendLine("- Only rewrite the **inner visible text** to match the target tone.");
            sb.AppendLine("- Return the rewritten content as valid HTML.");
            sb.AppendLine("- ❌ Do NOT wrap the response in code blocks, triple backticks, or markdown formatting.");
            sb.AppendLine();
            sb.AppendLine($"Tone: {tone.ToLower()}");
            sb.AppendLine();
            sb.AppendLine("Original HTML:");
            sb.AppendLine(originalHtml);
            sb.AppendLine();
            sb.AppendLine("Transformed HTML (Do not use code blocks, markdown, or triple backticks. Just return valid HTML as plain text):");

            return sb.ToString();
        }
        public static string BuildSuggestedReplyPrompt(List<string> thread, string initiatorRole)
        {
            var sb = new StringBuilder();
            sb.AppendLine("You are a helpful AI assistant in a support ticket system.");
            sb.AppendLine("This is a chat between a Normal User (NORMALUSER) and an Admin (ADMIN).");
            sb.AppendLine();
            sb.AppendLine("Conversation:");
            foreach (var line in thread)
            {
                sb.AppendLine(line.Trim());
            }
            sb.AppendLine();
            sb.AppendLine($"Now reply as the {initiatorRole}.");
            sb.AppendLine("Your reply should be:");
            sb.AppendLine("- Simple and clear.");
            sb.AppendLine("- Helpful and friendly.");
            sb.AppendLine("- Relevant to the conversation.");
            sb.AppendLine();
            sb.AppendLine("Extra tips:");
            sb.AppendLine("- If you're sending a follow-up, keep it short and polite.");
            sb.AppendLine("- Don’t repeat the same phrases.");
            sb.AppendLine("- If details are missing, make a good guess based on common support issues.");
            sb.AppendLine();
            sb.AppendLine("Reply:");

            return sb.ToString();
        }
        public static string BuildPromptedMessageTransformPrompt(string originalMessage, string prompt, string tone)
        {
            var sb = new StringBuilder();
            sb.AppendLine("You are a smart AI transformer.");
            sb.AppendLine("Rewrite the original HTML message based on the prompt.");
            sb.AppendLine("Preserve all HTML tags and formatting.");
            sb.AppendLine("Do not return markdown or wrap the response in triple backticks.");
            sb.AppendLine("Return only valid HTML. Do not add ```html or ``` markers.");

            sb.AppendLine(!string.IsNullOrWhiteSpace(tone)
                ? $"Maintain the tone as: {tone.Trim()}."
                : "Maintain the original tone of the message.");

            sb.AppendLine();
            sb.AppendLine("Prompt:");
            sb.AppendLine(string.IsNullOrWhiteSpace(prompt) ? "[No prompt provided]" : prompt.Trim());

            sb.AppendLine();
            sb.AppendLine("Original Message (HTML):");
            sb.AppendLine(originalMessage.Trim());

            sb.AppendLine();
            sb.AppendLine("Transformed Message (HTML):");

            return sb.ToString();
        }
        public static string BuildConversationSummaryPrompt(List<string> thread)
        {
            var sb = new StringBuilder();
            //sb.AppendLine("You are a helpful AI assistant. Summarize the following conversation into a concise, professional, and informative support ticket summary.");
            sb.AppendLine("You are a helpful AI assistant.");
            sb.AppendLine("Summarize the following support conversation into a clear, concise, and professional summary.");
            sb.AppendLine("Use valid HTML tags such as <p>, <strong>, <ul>, and <li> where appropriate to format the summary.");
            sb.AppendLine("Avoid using markdown symbols (e.g., **, _, #)");
            sb.AppendLine();
            sb.AppendLine("Conversation:");
            foreach (var line in thread)
            {
                sb.AppendLine(line);
            }
            sb.AppendLine();
            sb.AppendLine("Summary:");

            return sb.ToString();
        }

       
    }
}
