using ApplicationService.IRepository;
using DataRepository.EntityModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Net.Mail;
using System.Net.Sockets;

namespace DataRepository.Repository
{
    public class TicketRepository : ITicketRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _config;
        public TicketRepository(ApplicationDbContext context,
            UserManager<ApplicationUser> userManager, IConfiguration config)
        {
            _context = context;
            _userManager = userManager;
            _config = config;   
        }
        public async Task<CreateTicketDBResponse> CreateTicket(CreateTicketModel ticketModel)
        {
            if (_context.Tickets == null)
            {
                return new CreateTicketDBResponse
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
                    CreatedOn = DateTime.UtcNow,
                    status = "OPEN",
                    IsDeleted = false,
                    DepartmentId=ticketModel.DepartmentId
                };
                _context.Tickets.Add(ticket);
                await _context.SaveChangesAsync();

                var mailModel = (from user in _context.Users
                                 join userrole in _context.UserRoles on user.Id equals userrole.UserId
                                 join role in _context.Roles on userrole.RoleId equals role.Id
                                 where user.Id == ticketModel.CreatedBy
                                 select new TicketMailModel
                                 {
                                     CreatorName = user.FirstName + " " + user.LastName,
                                     Emails = (
                                      (from adminUser in _context.Users
                                       join adminuserrole in _context.UserRoles on adminUser.Id equals adminuserrole.UserId
                                       join adminrole in _context.Roles on adminuserrole.RoleId equals adminrole.Id
                                       where adminrole.Name.ToUpper() == "ADMIN"
                                       select new ReceiverMailModel
                                       {
                                           Email = adminUser.Email,
                                           RecipientName = adminUser.FirstName + " " + adminUser.LastName
                                       }
                                      ).ToList()
                                     )
                                 }
                               ).FirstOrDefault();



                return new CreateTicketDBResponse
                {
                    Status = "SUCCEED",
                    Message = "Ticket successfully created",
                    TicketId=ticket.TicketId,
                    MailModel =mailModel
                };
            }
            catch (Exception ex)
            {
                return new CreateTicketDBResponse
                {
                    Status = "FAILED",
                    Message = ex.Message
                };

            }
            finally
            {
                //_context.Dispose();
            }
        }
        public async Task<IEnumerable<TicketViewResponse>> GetTickets(string userId,int companyId)
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

                result=(from ticket in _context.Tickets
                        join appuser in _context.Users on  ticket.CreatedBy equals appuser.Id
                        where 
                        ((userRoles.FirstOrDefault().ToUpper() == "ADMIN" || userRoles.FirstOrDefault().ToUpper() == "SUPERADMIN") ?true: ticket.CreatedBy == userId) 
                        && appuser.CompanyId== companyId
                        orderby ticket.CreatedOn descending
                        select new TicketViewResponse {
                            TicketNumber = ticket.TicketId,
                            Subject = ticket.Subject,
                            CreatedOn = ticket.CreatedOn,
                            Priority = ticket.Priority,
                            Status = ticket.status
                        }
                        ).ToList();


                //if (userRoles.FirstOrDefault().ToUpper() == "ADMIN")
                //{
                //    result = await _context.Tickets.OrderByDescending(ticket => ticket.CreatedOn).Select(ticket => new TicketViewResponse { TicketNumber = ticket.TicketId, Subject = ticket.Subject, CreatedOn = ticket.CreatedOn, Priority = ticket.Priority, Status = ticket.status }).ToListAsync();

                //}
                //else
                //{
                //    result = await _context.Tickets.Where(ticket => ticket.CreatedBy == userId).OrderByDescending(ticket => ticket.CreatedOn).Select(ticket => new TicketViewResponse { TicketNumber = ticket.TicketId, Subject = ticket.Subject, CreatedOn = ticket.CreatedOn, Priority = ticket.Priority, Status = ticket.status }).ToListAsync();
                //}
                return result;
            }
            catch (Exception ex)
            {
                return null;
            }
            finally
            {
                //_context.Dispose();
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
            finally
            {
                //_context.Dispose();
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
                                                                              CreatedBy = users.FirstName + " " + users.LastName,
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
            finally
            {
                //_context.Dispose();
            }
        }

        public async Task<ConversationDBResponseStatus> AddConversationMessage(RequestConversationMessage conversationMessage)
        {
            if (_context.Tickets == null)
            {
                return new ConversationDBResponseStatus
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
                    CreatedOn = DateTime.UtcNow,
                    IsDeleted = false
                };
                _context.TicketConversationTracks.Add(conversationTrack);

                //check if current ticket status  
                var ticketdetail = (from ticket in _context.Tickets
                                    where ticket.TicketId == conversationMessage.TicketId
                                    select ticket
                                   ).FirstOrDefault();

                if(ticketdetail.status== "CLOSED")
                {
                   var statusresponse=  await ChangeTicketStatusById(ticketdetail.TicketId,conversationMessage.CreatedBy, "OPEN");
                    if(statusresponse.Status!= "SUCCEED")
                    {
                        return new ConversationDBResponseStatus
                        {
                            Status = "FAILED",
                            Message = statusresponse.Message
                        };
                    }
                }

                await _context.SaveChangesAsync();

                //Get detail for Mail
                var mailModel = (from user in _context.Users
                                 join userrole in _context.UserRoles on user.Id equals userrole.UserId
                                 join role in _context.Roles on userrole.RoleId equals role.Id
                                  where user.Id == conversationMessage.CreatedBy
                                  select new ConversationMailModel
                                  {
                                      CreatorName = user.FirstName + " " + user.LastName,
                                      TicketId=conversationMessage.TicketId,
                                      Emails=(role.Name.ToUpper()=="ADMIN")?(
                                      //If admin than get ticket create Email 
                                      (from ticket in _context.Tickets
                                       join ticketUser in _context.Users on ticket.CreatedBy equals ticketUser.Id
                                       where ticket.TicketId == conversationMessage.TicketId
                                       select new ReceiverMailModel
                                       {
                                           Email=ticketUser.Email,
                                           RecipientName= ticketUser.FirstName+" "+ticketUser.LastName
                                       }
                                       ).ToList()
                                      ):(
                                      //If normal User then get all admin email 
                                       (from adminUser in _context.Users
                                        join adminuserrole in _context.UserRoles on adminUser.Id equals adminuserrole.UserId
                                        join adminrole in _context.Roles on adminuserrole.RoleId equals adminrole.Id
                                        where adminrole.Name.ToUpper() == "ADMIN"
                                        select new ReceiverMailModel
                                        {
                                            Email = adminUser.Email,
                                            RecipientName = adminUser.FirstName + " " + adminUser.LastName
                                        }
                                       ).ToList()
                                      )
                                  }
                                ).FirstOrDefault();

                return new ConversationDBResponseStatus
                {
                    Status = "SUCCEED",
                    Message = "Message sent successfully",
                    ConversationId = conversationTrack.ConversationTrackId,
                    MailModel = mailModel,
                };
            }
            catch (Exception ex)
            {
                return new ConversationDBResponseStatus
                {
                    Status = "FAILED",
                    Message = ex.Message
                };

            }
            finally
            {
                //_context.Dispose();
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
                    ticket.ModifiedOn=DateTime.UtcNow;
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
            finally
            {
               // _context.Dispose();
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
                                  select new DataRepository.EntityModels.Attachment
                                  {
                                      referenceId = referanceId,
                                      AttachmentType = attachmentType,
                                      Name = file.FileName,
                                      Type = Path.GetExtension(file.FileName),
                                      ByteSize = file.ByteSize,
                                      CreatedOn = DateTime.UtcNow
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
            finally
            {
               // _context.Dispose();
            }
        }

    }
}
