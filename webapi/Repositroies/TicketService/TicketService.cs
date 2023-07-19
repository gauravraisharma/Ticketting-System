using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Net.Mail;
using System.Net.Sockets;
using webapi.Models;

namespace webapi.Repositroies.TicketService
{
    public class TicketService : ITicketService
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _config;
        public TicketService(ApplicationDbContext context,
            UserManager<ApplicationUser> userManager, IConfiguration config)
        {
            _context = context;
            _userManager = userManager;
            _config = config;   
        }
        public async Task<CreateTicketResponse> CreateTicket(CreateTicketModel ticketModel)
        {
            if (_context.Tickets == null)
            {
                return new CreateTicketResponse
                {
                    Status = "FAILED",
                    Message = "Db Context is empty"
                };
            }

            try
            {
                Ticket ticket = new Ticket()
                {
                    Priority = ticketModel.Priority,
                    Subject = ticketModel.Subject,
                    Description = ticketModel.Description,
                    CreatedBy = ticketModel.CreatedBy,
                    CreatedOn = DateTime.Now,
                    status = "OPEN",
                    IsDeleted = false
                };
                _context.Tickets.Add(ticket);
                await _context.SaveChangesAsync();
                return new CreateTicketResponse
                {
                    Status = "SUCCEED",
                    Message = "Ticket successfully created",
                    TicketId=ticket.TicketId
                };
            }
            catch (Exception ex)
            {
                return new CreateTicketResponse
                {
                    Status = "FAILED",
                    Message = ex.Message
                };

            }
        }
        public async Task<IEnumerable<TicketViewResponse>> GetTickets(string userId)
        {
            if (_context.Tickets == null)
            {
                return null;
            }
            try
            {
                // get the role of the user 
                var user = await _userManager.FindByIdAsync(userId);
                var userRoles = await _userManager.GetRolesAsync(user);

                IEnumerable<TicketViewResponse> result;
                if (userRoles.FirstOrDefault().ToUpper() == "ADMIN")
                {
                    result = await _context.Tickets.OrderByDescending(ticket => ticket.CreatedOn).Select(ticket => new TicketViewResponse { TicketNumber = ticket.TicketId, Subject = ticket.Subject, CreatedOn = ticket.CreatedOn, Priority = ticket.Priority, Status = ticket.status }).ToListAsync();

                }
                else
                {
                    result = await _context.Tickets.Where(ticket => ticket.CreatedBy == userId).OrderByDescending(ticket => ticket.CreatedOn).Select(ticket => new TicketViewResponse { TicketNumber = ticket.TicketId, Subject = ticket.Subject, CreatedOn = ticket.CreatedOn, Priority = ticket.Priority, Status = ticket.status }).ToListAsync();
                }
                return result;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<TicketDetailResponse> GetTicketDataById(int ticketId)
        {
            if (_context.Tickets == null)
            {
                return null;
            }

            try
            {
                TicketDetailResponse ticketDetail = new TicketDetailResponse();

                //ticketDetail.TicketDetail = _context.Tickets.Where(ticket => ticket.TicketId == ticketId).Select(ticket => new TicketDetail { TicketId = ticket.TicketId, Subject = ticket.Subject, CreatedOn = ticket.CreatedOn, Priority = ticket.Priority, Status = ticket.status, Description = ticket.Description }).ToList().FirstOrDefault();
                ticketDetail.TicketDetail = (from ticket in _context.Tickets
                                             join users in _context.Users on ticket.CreatedBy equals users.Id
                                             where ticket.TicketId == ticketId
                                             select new TicketDetail
                                             {
                                                 TicketId = ticket.TicketId,
                                                 Subject = ticket.Subject,
                                                 CreatedOn = ticket.CreatedOn,
                                                 CreatedBy = users.UserName,
                                                 Priority = ticket.Priority,
                                                 Status = ticket.status,
                                                 Description = ticket.Description,
                                                 attachments = (from attachment in _context.Attachments
                                                                where attachment.referenceId == ticketId && attachment.AttachmentType== "TICKET"
                                                                select new AttachmentDetail
                                                                {
                                                                    attachmentName= attachment.Name,
                                                                    downLoadLink= string.Concat( _config["AssetLink"], "\\Attachments\\", attachment.Name)
                                                                }
                                                                ).ToList()
                                             }
                                             ).ToList().FirstOrDefault();

                ticketDetail.conversationDetailList = (from conversations in _context.TicketConversationTracks
                                                       join users in _context.Users on conversations.CreatedBy equals users.Id
                                                       join userRoles in _context.UserRoles on users.Id equals userRoles.UserId
                                                       join role in _context.Roles on userRoles.RoleId equals role.Id
                                                       where conversations.TicketId == ticketId
                                                       orderby conversations.CreatedOn descending
                                                       select new conversationDetail
                                                       {
                                                           ConversationId = conversations.ConversationTrackId,
                                                           Message = conversations.Message,
                                                           CreatedOn = conversations.CreatedOn,
                                                           CreatedBy = users.FirstName+" "+users.LastName,
                                                           UserType = role.Name.ToUpper(),
                                                           attachments = (from attachment in _context.Attachments
                                                                          where attachment.referenceId == conversations.ConversationTrackId && attachment.AttachmentType == "CONVERSATION"
                                                                          select new AttachmentDetail
                                                                          {
                                                                              attachmentName = attachment.Name,
                                                                              downLoadLink = string.Concat(_config["AssetLink"], "\\Attachments\\", attachment.Name)
                                                                          }
                                                                ).ToList()
                                                       }
                                             ).ToList();
                return ticketDetail;
            }
            catch (Exception ex)
            {
                return null;
            }

        }

        public async Task<IEnumerable<conversationDetail>> GetTicketConversationDataById(int ticketId)
        {
            if (_context.Tickets == null)
            {
                return null;
            }

            try
            {



                IEnumerable<conversationDetail> conversationDetailList = (from conversations in _context.TicketConversationTracks
                                                                          join users in _context.Users on conversations.CreatedBy equals users.Id
                                                                          join userRoles in _context.UserRoles on users.Id equals userRoles.UserId
                                                                          join role in _context.Roles on userRoles.RoleId equals role.Id
                                                                          where conversations.TicketId == ticketId
                                                                          orderby conversations.CreatedOn descending
                                                                          select new conversationDetail
                                                                          {
                                                                              ConversationId = conversations.ConversationTrackId,
                                                                              Message = conversations.Message,
                                                                              CreatedOn = conversations.CreatedOn,
                                                                              CreatedBy = users.UserName,
                                                                              UserType = role.Name.ToUpper(),
                                                                              attachments = (from attachment in _context.Attachments
                                                                                             where attachment.referenceId == conversations.ConversationTrackId && attachment.AttachmentType == "CONVERSATION"
                                                                                             select new AttachmentDetail
                                                                                             {
                                                                                                 attachmentName = attachment.Name,
                                                                                                 downLoadLink = string.Concat(_config["AssetLink"], "\\Attachments\\", attachment.Name)
                                                                                             }
                                                                ).ToList()
                                                                          }
                                             ).ToList();
                return conversationDetailList;
            }
            catch (Exception ex)
            {
                return null;
            }

        }

        public async Task<ConversationResponseStatus> AddConversationMessage(RequestConversationMessage conversationMessage)
        {
            if (_context.Tickets == null)
            {
                return new ConversationResponseStatus
                {
                    Status = "FAILED",
                    Message = "Db Context is empty"
                };
            }

            try
            {
                TicketConversationTrack conversationTrack = new TicketConversationTrack()
                {
                    TicketId = conversationMessage.TicketId,
                    Message = conversationMessage.Message,
                    CreatedBy = conversationMessage.CreatedBy,
                    CreatedOn = DateTime.Now,
                    IsDeleted = false
                };
                _context.TicketConversationTracks.Add(conversationTrack);
                await _context.SaveChangesAsync();
                return new ConversationResponseStatus
                {
                    Status = "SUCCEED",
                    Message = "Message sent successfully",
                    ConversationId = conversationTrack.ConversationTrackId,
                };
            }
            catch (Exception ex)
            {
                return new ConversationResponseStatus
                {
                    Status = "FAILED",
                    Message = ex.Message
                };

            }
        }

        public async Task<ResponseStatus> ChangeTicketStatusById(int ticketId, string userId, string status)
        {
            if (_context.Tickets == null)
            {
                return new ResponseStatus
                {
                    Status = "FAILED",
                    Message = "Db Context is empty"
                };
            }

            try
            {
                var query = from ticket in _context.Tickets
                            where ticket.TicketId == ticketId
                            select ticket;
                foreach (Ticket ticket in query)
                {
                    ticket.status = status;
                    ticket.ModifiedBy = userId;
                    ticket.ModifiedOn=DateTime.Now;
                }
                try
                {
                   await _context.SaveChangesAsync();
                }
                catch (Exception e)
                {
                    return new ResponseStatus
                    {
                        Status = "FAILED",
                        Message = "Something went wrong"
                    };
                }
                return new ResponseStatus
                {
                    Status = "SUCCEED",
                    Message = "Ticket Successfully closed"
                };
            }
            catch (Exception ex)
            {
                return new ResponseStatus
                {
                    Status = "FAILED",
                    Message = ex.Message
                };

            }
        }


        public async Task<DashboardResponseStatus> GetTotalTicketCount(string userId)
        {
            if (_context.Tickets == null)
            {
                return null;
            }
            try
            {
                // get the role of the user 
                var user = await _userManager.FindByIdAsync(userId);
                var userRoles = await _userManager.GetRolesAsync(user);
                int ticketCount,userCount=0;
                if (userRoles.FirstOrDefault().ToUpper() == "ADMIN")
                {
                    ticketCount = _context.Tickets.Count();
                    userCount = _context.Users.Count();
                }
                else
                {
                    ticketCount = _context.Tickets.Where(ticket =>  ticket.CreatedBy==userId).Count();
                }

                    return new DashboardResponseStatus() {
                    ToatlTickets = ticketCount,
                    ToatlUsers= userCount,
                    Status ="SUCCEED",
                    Message = "Ticket Count got successfully",
                    };
            }
            catch (Exception ex)
            {
                return new DashboardResponseStatus()
                {
                    Message = "Something went wrong",
                    Status = "FAILED"
                };
            }
        } 
        public  ResponseStatus AddAttachMents(int referanceId, List<FileUploadResponse> fileDetails, string attachmentType)
        {
            if (_context.Tickets == null)
            {
                return null;
            }
            try
            {

                var attachments = from file in fileDetails
                                  select new Models.Attachment
                                  {
                                      referenceId = referanceId,
                                      AttachmentType = attachmentType,
                                      Name = file.FileName,
                                      Type = Path.GetExtension(file.FileName),
                                      ByteSize = file.ByteSize,
                                      CreatedOn = DateTime.Now
                                  };
                _context.Attachments.AddRange(attachments);
                _context.SaveChanges();
                return new ResponseStatus
                {
                    Status = "SUCCEED",
                    Message = "attachment saved successfully"
                };
            }
            catch (Exception ex)
            {
                return new ResponseStatus
                {
                    Status = "FAILED",
                    Message = ex.Message
                };

            }
        }

    }
}
