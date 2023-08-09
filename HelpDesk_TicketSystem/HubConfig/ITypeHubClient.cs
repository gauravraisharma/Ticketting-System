using DataRepository.EntityModels;

namespace HelpDesk_TicketSystem.SignalR
{
    public interface ITypeHubClient
    {
        Task BroadCastMessage(Message message);
    }
}
