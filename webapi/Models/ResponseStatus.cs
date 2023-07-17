namespace webapi.Models
{
    public class LoginStatus
    {
        public string Status { get; set; }
        public string Message { get; set; }
        public string? Token { get; set; }
        public string? UserType { get; set; }
        public string? UserId { get; set; }
    }
    public class ResponseStatus
    {
        public string Status { get; set; }
        public string Message { get; set; }
    }
    public class ConversationResponseStatus
    {
        public string Status { get; set; }
        public string Message { get; set; }
        public int ConversationId { get; set; }
    }
     public class CreateTicketResponse
    {
        public string Status { get; set; }
        public string Message { get; set; }
        public int TicketId { get; set; }
    }

    public class TicketViewResponse
    {
        public int TicketNumber { get; set; }
        public string Subject { get; set; }
        public string Priority { get; set; }
        public string Status { get; set; }
        public DateTime CreatedOn { get; set; }
    }

    public class TicketDetail
    {
        public int TicketId { get; set; }
        public string Subject { get; set; }
        public string Priority { get; set; }
        public string Status { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public string Description { get; set; }
        public List<AttachmentDetail> attachments { get; set; }
    }

    public class AttachmentDetail
    {
        public string attachmentName { get; set; }
        public string downLoadLink { get; set; }
    }
    public class conversationDetail
    {
        public int ConversationId { get; set; }
        public string Message { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public string UserType { get; set; }
        public List<AttachmentDetail> attachments { get; set; }
    }


    public class TicketDetailResponse
    {
        public TicketDetail TicketDetail { get; set; }
        public IEnumerable<conversationDetail> conversationDetailList { get; set; }

    }

    public class FileUploadResponse {
        public string FileName { get; set; }
        public long ByteSize { get; set; }
    }


}
