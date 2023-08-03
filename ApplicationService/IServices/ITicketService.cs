using DataRepository.EntityModels;
using Microsoft.AspNetCore.Http;
using Microsoft.VisualBasic;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationService.IServices
{
    public interface ITicketService
    {
        Task<CreateTicketResponse> CreateTicket(CreateTicketModel ticketModel);
        Task<IEnumerable<TicketViewResponse>> GetTickets(string userId, int companyId);
        Task<TicketDetailResponse> GetTicketDataById(int ticketId);
        Task<ConversationResponseStatus> AddConversationMessage(RequestConversationMessage conversationMessage);
        ResponseStatus AddAttachMents(int ticketId, IFormFileCollection files, string attachmentType);
        Task<IEnumerable<conversationDetail>> GetTicketConversationDataById(int ticketId);
        Task<ResponseStatus> ChangeTicketStatusById(int ticketId, string userId, string status);
       
    }
}
