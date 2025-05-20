using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataRepository.EntityModels
{
    public class GeminiResponseModel
    {
        public class TransformToneResponseModel
        {
            public string Result { get; set; } = string.Empty;
        }

        public class SuggestedReplyResponseModel
        {
            public string Reply { get; set; } = string.Empty;
        }

        public class TransformPromptedMessageResponseModel
        {
            public bool Success { get; set; }
            public string? ErrorMessage { get; set; }
            public string Result { get; set; } = string.Empty;
        }
    }
}
