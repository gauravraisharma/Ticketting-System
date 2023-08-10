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
        Task<List<GetChatUsersResponse>> GetChatUsers();
        Task<List<ChatResponse>> GetChatByRoomId(int ChatRoomId);
    
    }
}
