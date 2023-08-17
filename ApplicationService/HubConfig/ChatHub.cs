using ApplicationService.IServices;
using ApplicationService.HubModel;
using Microsoft.AspNetCore.SignalR;

namespace ApplicationService.SignalR
{
    public class ChatHub : Hub
    {
        private IChatService _chatService;
        public ChatHub(IChatService chatService)
        {
                _chatService = chatService;
        }
        public async Task JoinChatRoom(string chatRoomId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, chatRoomId);
        }
        public async Task LeaveChatRoom(string chatRoomId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, chatRoomId);
        }
        public async Task SendMessageToUser(ChatMessage chatmessage)
        {
            try
            {
                _chatService.SaveChatMessage(chatmessage.Message, chatmessage.ChatRoomId, chatmessage.UserId, true);
                await Clients.Group(chatmessage.ChatRoomId).SendAsync("responseFormAdmin", chatmessage.Message);
            }catch (Exception ex) { throw; }
        }
        
        public async Task sendMessageToAdmin(ChatMessageFromClient chatmessage)
        {
            await _chatService.SaveChatMessage(chatmessage.Message, chatmessage.ChatRoomId, chatmessage.UserId, false);
            await Clients.All.SendAsync("responseFormClient", chatmessage.Message, chatmessage.ChatRoomId, chatmessage.CompanyId, chatmessage.DepartmentId);
            await Clients.All.SendAsync("NewMessageFromCLient", chatmessage.ChatRoomId, chatmessage.CompanyId, chatmessage.DepartmentId);

           
        }
    }
}
