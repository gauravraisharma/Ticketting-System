using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static DataRepository.EntityModels.GeminiCommonModel;

namespace DataRepository.EntityModels
{
    public class GeminiRequestModel
    {
        public class PromptTransformRequest
        {
            public string OriginalMessage { get; set; }
            public string Prompt { get; set; }
            public string Tone { get; set; }
        }



        public class ToneRequest
        {
            public string Message { get; set; }
            public string Tone { get; set; }
        }
        public class GeminiRequest
        {
            public List<Content> contents { get; set; }
        }

        //public class Content
        //{
        //    public string role { get; set; }
        //    public List<Part> parts { get; set; }
        //}

        //public class Part
        //{
        //    public string text { get; set; }
        //}

        //public class GeminiResponse
        //{
        //    public List<Candidate> candidates { get; set; }
        //}

        //public class Candidate
        //{
        //    public Content content { get; set; }
        //}
        public class GeminiConversationRequest
        {
            public List<string> ConversationThread { get; set; }
            public string InitiatorRole { get; set; }
        }
    }
}
