using Microsoft.AspNetCore.SignalR;

namespace HelpDesk_TicketSystem.SignalR
{
    public class NotifyHub : Hub
    {
        public async Task SendMessageToUser( string message)
        {
            await Clients.All.SendAsync("responseFormAdmin", message);
        }
        
        public async Task sendMessageToAdmin( string message)
        {
            await Clients.All.SendAsync("responseFormClient", message);
        }
    }
}
