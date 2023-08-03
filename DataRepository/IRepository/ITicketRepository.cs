using DataRepository.EntityModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationService.IRepository
{
    public interface ITicketRepository
    {
        Task<CreateTicketDBResponse> CreateTicket(CreateTicketModel ticketModel);
        Task<IEnumerable<TicketViewResponse>> GetTickets(string userId, int companyId);
        Task<TicketDetailResponse> GetTicketDataById(int ticketId);
        Task<ConversationDBResponseStatus> AddConversationMessage(RequestConversationMessage conversationMessage);
        ResponseStatus AddAttachMents(int referanceId, List<FileUploadResponse> fileDetails, string attachmentType);
        Task<IEnumerable<conversationDetail>> GetTicketConversationDataById(int ticketId);
        Task<ResponseStatus> ChangeTicketStatusById(int ticketId, string userId, string status);
        
    }
}
