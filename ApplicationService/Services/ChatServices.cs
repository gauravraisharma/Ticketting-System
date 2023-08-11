using ApplicationService.IServices;
using ApplicationService.Utilities;
using DataRepository.EntityModels;
using DataRepository.IRepository;
using DataRepository.Repositoryy;
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
       
        public ChatService(IChatRepository chatRepository)
        {
            _chatRepository = chatRepository;
        }

        public async Task<ChatUserResponse> ChatUserRegister(ChatUserRegister chatUserModel)
        {
           return await _chatRepository.ChatUserRegister(chatUserModel);
        }

        public async Task<List<ChatResponse>> GetChatByRoomId(int ChatRoomId)
        {
           return await _chatRepository.GetChatByRoomId(ChatRoomId);
        }

        public async Task<List<GetChatUsersResponse>> GetChatUserDetails(int ChatRoomId)
        {
            return await _chatRepository.GetChatUserDetails(ChatRoomId);
        }

        public async Task<List<GetChatUsersResponse>> GetChatUsers()
        {
            return await _chatRepository.GetChatUsers();
        }
    }
}
