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

        public async Task<ChatUserResponse> ChatUserRegister(ChatUserRegister chatUserModel)
        {
            if (_context.ChatUsers == null)
            {
                return new ChatUserResponse
                {
                    ChatRoomId = 0,
                    Status = "FAILED",
                    Message = "Db context is empty"

                };

            }
            try
            {
                var user = await _context.ChatUsers.FirstOrDefaultAsync(r => r.email == chatUserModel.Email);
                if (user != null) 
                {
                    var userChatRoom = await _context.ChatRooms.FirstOrDefaultAsync(r => r.ChatUserId == user.Id);
                    return new ChatUserResponse
                    {
                        ChatRoomId = userChatRoom.Id,
                        Status = "SUCCEED",
                        Message="Your chat room id is "+userChatRoom.Id+""
                    };
                }
                ChatUser chatUser = new ChatUser()
                {
                    Name = chatUserModel.Name,
                    email = chatUserModel.Email,
                    PhoneNumber = chatUserModel.PhoneNumber,
                    DepartmentId = chatUserModel.DepartmentId,
                    IsDeleted = false,
                };
                _context.ChatUsers.Add(chatUser);
                await _context.SaveChangesAsync();
                ChatRoom chatRoom = new ChatRoom()
                {
                    ChatUserId = chatUser.Id
                };
                _context.ChatRooms.Add(chatRoom);
                await  _context.SaveChangesAsync();
                return new ChatUserResponse
                {
                    ChatRoomId = chatRoom.Id,
                    Status = "SUCCEED",
                    Message = "Successfully registered you chatroom id is "+chatRoom.Id+ ""

                };
            }
            catch (Exception ex) 
            {
                return new ChatUserResponse
                {
                    ChatRoomId = 0,
                    Status = "FAILED",
                    Message = "Something went wrong"

                };
            }
        }
    }
}
