using DataRepository.EntityModels;
using DataRepository.IRepository;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataRepository.Repositoryy
{
    public class ChatRepository:IChatRepository
    {
        private readonly ApplicationDbContext _context;
        public ChatRepository(
            ApplicationDbContext context
           )
        {
           _context = context;
        }

       
    }
}
