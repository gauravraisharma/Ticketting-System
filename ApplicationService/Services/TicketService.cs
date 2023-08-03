using ApplicationService.IRepository;
using ApplicationService.IServices;
using Azure.Core;
using Azure;
using DataRepository.EntityModels;
using DataRepository.IRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting.Internal;
using ApplicationService.Utilities;
using Microsoft.AspNetCore.Http;

namespace ApplicationService.Services
{
    public class TicketService : ITicketService
    {
        private readonly ITicketRepository _ticketRepository ;

        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly IConfiguration _config;
        public TicketService(ITicketRepository ticketRepository, IWebHostEnvironment hostingEnvironment, IConfiguration config)
        {
            _ticketRepository = ticketRepository;
            _hostingEnvironment = hostingEnvironment;
            _config = config;
        }
        public ResponseStatus AddAttachMents(int ticketId, IFormFileCollection files, string attachmentType)
        {
            // Upload the file in system 
            List<FileUploadResponse> attachmentsResponse = FileOperation.UploadFile(files, _hostingEnvironment, _config);
            if (attachmentsResponse != null)
            {
                ResponseStatus attachmentResponse = _ticketRepository.AddAttachMents(ticketId, attachmentsResponse, attachmentType);
                return attachmentResponse;
            }
            return new ResponseStatus {
                Status="FAILED",
                Message="Somethinh went wrong while uploading the attachment."
            };

        }

        public async Task<ConversationResponseStatus> AddConversationMessage(RequestConversationMessage conversationMessage)
        {
            var response= await _ticketRepository.AddConversationMessage(conversationMessage);
            if (response.Status == "SUCCEED")
            {
                try
                {
                    var emailSubject=_config["ConversationEmailSubject"];
                    var emailTemplate=_config["ConversationEmailTemplate"];
                    var emails=response.MailModel.Emails.Select(mail=> mail.Email).ToList();
                    Dictionary<string, string> subjectVariable = new Dictionary<string, string>
                    {
                        { "@@ticketNumber", response.MailModel.TicketId.ToString() }
                    };
                    Dictionary<string, string> messageVariable = new Dictionary<string, string> {
                      { "@@ticketNumber", response.MailModel.TicketId.ToString() }
                    };

                     MailOperations.SendEmailAsync(emails, emailSubject, emailTemplate, _config, subjectVariable, messageVariable);
                }
                catch (Exception e)
                {

                }
            }

            return new ConversationResponseStatus
            {
                Message = response.Message,
                Status = response.Status,
                ConversationId = (response.Status=="FAILED")?0:response.ConversationId
            };

        }

        public Task<ResponseStatus> ChangeTicketStatusById(int ticketId, string userId, string status)
        {
            return _ticketRepository.ChangeTicketStatusById(ticketId,userId,status);
        }

        public async Task<CreateTicketResponse> CreateTicket(CreateTicketModel ticketModel)
        {
            var response= await _ticketRepository.CreateTicket(ticketModel);

            if (response.Status == "SUCCEED")
            {
                try
                {
                    var emailSubject = _config["TicketEmailSubject"];
                    var emailTemplate = _config["TicketEmailTemplate"];
                    var emails = response.MailModel.Emails.Select(mail => mail.Email).ToList();

                    Dictionary<string, string> subjectVariable = new Dictionary<string, string>
                    {
                        { "@@ticketNumber", response.TicketId.ToString() }
                    };
                    Dictionary<string, string> messageVariable = new Dictionary<string, string> {
                      { "@@ticketNumber", response.TicketId.ToString() }
                    };

                     MailOperations.SendEmailAsync(emails, emailSubject, emailTemplate, _config, subjectVariable, messageVariable);
                }
                catch (Exception e)
                {

                }
            }
            return new CreateTicketResponse
            {
                Message = response.Message,
                Status = response.Status,
                TicketId = (response.Status == "FAILED") ? 0 : response.TicketId
            }; ;
        }

        public Task<IEnumerable<conversationDetail>> GetTicketConversationDataById(int ticketId)
        {
            return _ticketRepository.GetTicketConversationDataById(ticketId);
        }

        public Task<TicketDetailResponse> GetTicketDataById(int ticketId)
        {
            return _ticketRepository.GetTicketDataById(ticketId);
        }

        public Task<IEnumerable<TicketViewResponse>> GetTickets(string userId, int companyId)
        {
            return _ticketRepository.GetTickets(userId,companyId);
        }

     
    }
}
