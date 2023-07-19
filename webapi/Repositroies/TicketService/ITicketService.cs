using webapi.Models;

namespace webapi.Repositroies.TicketService
{
    public interface ITicketService
    {

        Task<CreateTicketResponse> CreateTicket(CreateTicketModel ticketModel);
        Task<IEnumerable<TicketViewResponse>> GetTickets(string userId);
        Task<TicketDetailResponse> GetTicketDataById(int ticketId);
        Task<ConversationResponseStatus> AddConversationMessage(RequestConversationMessage conversationMessage);
        ResponseStatus AddAttachMents(int referanceId, List<FileUploadResponse> fileDetails, string attachmentType);
        Task<IEnumerable<conversationDetail>> GetTicketConversationDataById(int ticketId);
        Task<ResponseStatus> ChangeTicketStatusById(int ticketId, string userId, string status);
        Task<DashboardResponseStatus> GetTotalTicketCount(string userId);
    }
}
