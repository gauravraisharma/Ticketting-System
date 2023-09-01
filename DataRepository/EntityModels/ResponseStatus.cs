using System.ComponentModel.DataAnnotations;

namespace DataRepository.EntityModels
{
    public class LoginStatus
    {
        public string Status { get; set; }
        public string Message { get; set; }
        public string? Token { get; set; }
        public string? UserType { get; set; }
        public string? UserId { get; set; }
        public int? CompanyId { get; set; }
        public string? TimeZone { get; set; }
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
        public int ConversationId { get; set;}
    }
    public class ConversationDBResponseStatus
    {
        public string Status { get; set; }
        public string Message { get; set; }
        public int ConversationId { get; set; }
        public ConversationMailModel? MailModel { get; set; }
    }

    public class ConversationMailModel
    {
        public string CreatorName { get; set; }
        public int TicketId { get; set; }
        public List<ReceiverMailModel> Emails { get; set; }
    }
    
    public class TicketMailModel
    {
        public string CreatorName { get; set; }
        public List<ReceiverMailModel> Emails { get; set; }
    }
    public class ReceiverMailModel
    {
        public string Email { get; set; }
        public string RecipientName { get; set; }
    }


    public class CreateTicketResponse
    {
        public string Status { get; set; }
        public string Message { get; set; }
        public int TicketId { get; set; }
    }
    public class CreateTicketDBResponse
    {
        public string Status { get; set; }
        public string Message { get; set; }
        public int TicketId { get; set; }
        public TicketMailModel MailModel { get; set; }
    }

    public class DashboardResponseStatus
    {
        public string Status { get; set; }
        public string Message { get; set; }
        public int ToatlTickets { get; set; }
        public int? ToatlUsers { get; set; }
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

    public class DDListResponse
    {
        public string Status { get; set; }
        public IEnumerable<DropDownModel> DdList { get; set; }
    }
    public class DropDownModel
    {
        public dynamic id { get; set; }
        public string Label { get; set; }
    }

    public class ResponseApplicationUserModel
    {

        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string UserType { get; set; }
        public string Department { get; set; }
        public string CreatedBy { get; set; }
    }

    public class UserDataResponse {
        public string Status { get; set; }
        public string Message { get; set; }
        public UserDetailModel userDetail { get; set; }
    }

    public class UserDetailModel
    {
        public string Username { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserType { get; set; }
        public string? PhoneNumber { get; set; }
        public int? Department { get; set; }
        public string Email { get; set; }
        public string? Password { get; set; }
        public bool IsAdmin { get; set; }
    }
    public class GetCompanyResponse
    {
        public int CompanyId { get; set; }
        public string CompanyName { get; set; }
        public DateTime CreatedOn { get; set; }
        public int UserCount { get; set; } 
    
     }
    public class SwitchToAdminResponseStatus
    {
        public string Status { get; set; }
        public string Message { get; set; }
        public string? Timezone { get; }
    }
    public class ChatUserResponse 
    { 
        public Guid UserId { get; set; }
        public int ChatRoomId { get; set; }
        public bool IsExisting { get; set; }
        public string Status { get; set; }
        public string Message { get; set; }
    }
    public class GetChatUsersResponse 
    {
        public Guid ChatUserId { get; set; }
        public string ChatUserName { get; set; }
        public string Email { get; set; }
        public long PhoneNumber { get; set; }
        public int DepartmentId { get; set; }
        public int ChatRoomId { get; set; }
        public int UnReadMessageCount { get; set; }
    }

   public class ChatResponse
    {
        public string message { get; set; }
        public DateTime createdOn { get; set; }
        public string userType { get; set; }
    }

    public class PrioritChartResponse
    {
        public string PriorityName { get; set; }
        public int Value { get; set; }
    }
    public class TicketCreated
    {
        public DateTime Date { get; set; }
        public int Value { get; set; }

    }
}
