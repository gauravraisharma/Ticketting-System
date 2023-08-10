﻿using DataRepository.EntityModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationService.IServices
{
    public interface IChatService
    {
        Task<ChatUserResponse> ChatUserRegister(ChatUserRegister chatUserModel);
        Task<List<GetChatUsersResponse>> GetChatUsers();
    }
}
