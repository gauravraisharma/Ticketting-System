﻿using ApplicationService.IServices;
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

    
    }
}
