using ApplicationService.HubModel;
using ApplicationService.IServices;
using ApplicationService.SignalR;
using ApplicationService.Utilities;
using DataRepository.EntityModels;
using DataRepository.IRepository;
using DataRepository.Repositoryy;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationService.Services
{
    public class ChatService:IChatService
    {
        private readonly IChatRepository _chatRepository;
        private readonly IHubContext<ChatHub> _hubContext;
        public ChatService(IChatRepository chatRepository, IHubContext<ChatHub> hubContext)
        {
            _chatRepository = chatRepository;
            _hubContext = hubContext;
        }

        public async Task<ChatUserResponse> ChatUserRegister(ChatUserRegister chatUserModel)
        {
           var result= await _chatRepository.ChatUserRegister(chatUserModel);

            if (!result.IsExisting)
            {
                await _hubContext.Clients.All.SendAsync("NewUserChat", result.ChatRoomId,chatUserModel.CompanyId);

            }
            return result;
        }

        public async Task<List<ChatResponse>> GetChatByRoomId(int ChatRoomId)
        {
           return await _chatRepository.GetChatByRoomId(ChatRoomId);
        }

        public async Task<GetChatUsersResponse> GetChatUserDetails(int ChatRoomId)
        {
            return await _chatRepository.GetChatUserDetails(ChatRoomId);
        }

        public async Task<List<GetChatUsersResponse>> GetChatUsers(int companyId)
        {
            return await _chatRepository.GetChatUsers(companyId);
        }
        
        public  async Task SaveChatMessage(string message, string chatRoomId, string userId, bool IsAdmin)
        {
           await _chatRepository.SaveChatMessage(message, chatRoomId, userId, IsAdmin);
          
           await _chatRepository.IncreaseUnReadCount(chatRoomId);
            return;
        }
        
    }
}
