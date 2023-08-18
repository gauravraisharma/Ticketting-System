using DataRepository.EntityModels;
using DataRepository.IRepository;
using Microsoft.AspNetCore.Http.HttpResults;
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
                var user = await _context.ChatUsers.FirstOrDefaultAsync(r => r.email == chatUserModel.Email && r.companyId==chatUserModel.CompanyId);
                if (user != null) 
                {
                    var userChatRoom = await _context.ChatRooms.FirstOrDefaultAsync(r => r.ChatUserId == user.Id);
                    return new ChatUserResponse
                    {
                        UserId= user.Id,
                        IsExisting=true,
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
                    companyId=chatUserModel.CompanyId,  
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
                    UserId = chatUser.Id,
                    IsExisting=false,
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
                    Message = ex.Message

                };
            }
        }

        public async Task<List<ChatResponse>> GetChatByRoomId(int ChatRoomId)
        {
            if (_context.ChatDatas == null)
            {
                return null;
            }
            try
            {
                var chats =await _context.ChatDatas
                    .Where(chatData => chatData.ChatRoomId == ChatRoomId)
                    .OrderBy(chatData => chatData.CreatedOn)
                    .Select(ChatData => new ChatResponse
                    {
                      message = ChatData.Message,
                      userType= ChatData.UserType,
                      createdOn=ChatData.CreatedOn
                    }).ToListAsync();

                // update the chatroom count 
               var chatRoom = _context.ChatRooms.FirstOrDefault(room => room.Id == ChatRoomId);
                if (chatRoom != null)
                {
                    chatRoom.UnReadMessageCount = 0;
                   await  _context.SaveChangesAsync();
                }
                    return chats;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<GetChatUsersResponse> GetChatUserDetails(int ChatRoomId)
        {
            if(_context.ChatRooms == null)
            {
                return null;
            }
            try
            {

                var chatUserDetails = await (from chatRoom in _context.ChatRooms
                                             where chatRoom.Id == ChatRoomId
                                             join chatUser in _context.ChatUsers
                                             on chatRoom.ChatUserId equals chatUser.Id
                                             select new GetChatUsersResponse
                                             {
                                                 ChatUserId = chatUser.Id,
                                                 ChatUserName = chatUser.Name,
                                                 Email = chatUser.email,
                                                 DepartmentId = chatUser.DepartmentId,
                                                 PhoneNumber = chatUser.PhoneNumber,
                                                 ChatRoomId = ChatRoomId,
                                                 UnReadMessageCount=chatRoom.UnReadMessageCount
                                             })
                                    .ToListAsync();

                return chatUserDetails.FirstOrDefault();
            }
            catch (Exception ex)
            {
                return null;
            }
        }


        public async Task<List<GetChatUsersResponse>> GetChatUsers(int companyId)
        {
            if (_context.ChatUsers == null)
                return null;
            try
            {

                var chatUsers = await (
                     from chatUser in _context.ChatUsers
                     join chatRoom in _context.ChatRooms on chatUser.Id equals chatRoom.ChatUserId
                     join chatData in _context.ChatDatas on chatRoom.Id equals chatData.ChatRoomId into chatDataGroup
                     where chatUser.companyId== companyId
                     let latestChatData = chatDataGroup.OrderByDescending(cd => cd.CreatedOn).FirstOrDefault()
                     orderby latestChatData.CreatedOn descending
                     select new GetChatUsersResponse
                     {
                         ChatUserId = chatUser.Id,
                         ChatUserName = chatUser.Name,
                         Email = chatUser.email,
                         DepartmentId = chatUser.DepartmentId,
                         PhoneNumber = chatUser.PhoneNumber,
                         ChatRoomId = chatRoom.Id,
                         UnReadMessageCount = chatRoom.UnReadMessageCount,
                     }
       ).ToListAsync();
                return chatUsers;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        public async Task SaveChatMessage(string message, string chatRoomId, string userId,bool IsAdmin)
        {
            if (_context.ChatUsers == null)
            {
                return ;

            }
            try
            {
                ChatData chatdata = new ChatData()
                {
                    ChatRoomId=int.Parse(chatRoomId),
                    Message=message,
                    CreatedBy=userId,
                    CreatedOn=DateTime.UtcNow,
                    UserType=(IsAdmin)?"ADMIN":"CHATUSER",
                    IsDeleted=false
                    
                };
                _context.ChatDatas.Add(chatdata);
                await _context.SaveChangesAsync();

                return ;
            }
            catch (Exception ex)
            {
                 throw;
            }
        }
        
        public async Task IncreaseUnReadCount(string chatRoomId)
        {
            if (_context.ChatUsers == null)
            {
                return ;

            }
            try
            {
                
                var chatRoom =_context.ChatRooms.FirstOrDefault(room=> room.Id==int.Parse( chatRoomId));
                if (chatRoom != null)
                {
                    chatRoom.UnReadMessageCount += 1;
                   await _context.SaveChangesAsync();
                }
                return ;
            }
            catch (Exception ex)
            {
                 throw;
            }
        }
    }
    }

