using DataRepository.EntityModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataRepository.IRepository
{
    public interface IChatRepository
    {
        Task<ChatUserResponse> ChatUserRegister(ChatUserRegister chatUserModel);
        Task<List<GetChatUsersResponse>> GetChatUsers(int companyId);
        Task<List<ChatResponse>> GetChatByRoomId(int ChatRoomId);
        Task<GetChatUsersResponse> GetChatUserDetails(int ChatRoomId);
    
        Task SaveChatMessage(string message, string chatRoomId, string userId,bool IsAdmin);
        Task IncreaseUnReadCount(string chatRoomId);
    }
}
