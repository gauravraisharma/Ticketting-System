using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ApplicationService.IServices;
using ApplicationService.Services;
using DataRepository.EntityModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace HelpDesk_TicketSystem.Controllers
{
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = "Bearer")]
    [ApiController]
    public class TicketsController : ControllerBase
    {

        private readonly ITicketService _ticketService;
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly IConfiguration _config;
        public TicketsController(ITicketService ticketService, IWebHostEnvironment hostingEnvironment, IConfiguration config)
        {
            _ticketService = ticketService;
            _hostingEnvironment = hostingEnvironment;
            _config = config;
        }

        //This method is used to get all the ticket 
        //Admin can see all the ticket 
        //Normal user can only see ticket created by him
        [HttpGet("GetTicket/{userId}/{companyId}")]
        public async Task<ActionResult<IEnumerable<TicketViewResponse>>> GetTickets(string userId,int companyId)
        {
          var resultlist= await _ticketService.GetTickets(userId,companyId);
            return Ok(resultlist);
        }

        //This method is used to get ticket detail by it ID 
        //It will return both ticket detail and conversation corresponding to ticket 
        [HttpGet("GetTicketDataById/{ticketId}")]
        public async Task<ActionResult<IEnumerable<TicketViewResponse>>> GetTicketDataById(int ticketId)
        {
          var dbResponse= await _ticketService.GetTicketDataById(ticketId);
            if (dbResponse == null)
            {
                return NotFound();
            }
            return Ok(dbResponse);
        }

        //This method is used to create new ticket 
        //Only Normal User can create new Ticket 
        [HttpPost("CreateTicket")]
        public async Task<ActionResult<ResponseStatus>> CreateTicket([FromForm] CreateTicketModel ticket)
        {

            if (!ModelState.IsValid)
            {
             
                return BadRequest("Please pass the valid Input.");
            }

            CreateTicketResponse response =await  _ticketService.CreateTicket(ticket);
            if(response.Status== "FAILED")
            {
                return BadRequest(response.Message);
            }
            if (Request.Form.Files.Count > 0)
            {

                ResponseStatus attachmentResponse= _ticketService.AddAttachMents(response.TicketId, Request.Form.Files, "TICKET");

                 if (attachmentResponse.Status == "FAILED")
                {
                    return Ok(new ResponseStatus
                    {
                        Status = "SUCCEED",
                        Message = "Ticket Has been created successfully but their is some issue while uploading the attachment. Please try adding attachments later."
                    });

                }

            }
            return Ok(response);
        }

        //This method is used to get add new message corresponding to a particular ticket
        [HttpPost("AddConversationMessage")]
        public async Task<ActionResult<ResponseStatus>> AddConversationMessage([FromForm] RequestConversationMessage conversationMessage)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest("Please pass the valid Input.");
            }


            ConversationResponseStatus response =await  _ticketService.AddConversationMessage(conversationMessage);
            if(response.Status== "FAILED")
            {
                return BadRequest(response.Message);
            }
            if (Request.Form.Files.Count > 0)
            {

                ResponseStatus attachmentResponse = _ticketService.AddAttachMents(response.ConversationId, Request.Form.Files, "CONVERSATION");

                if (attachmentResponse.Status == "FAILED")
                {
                    return Ok(new ResponseStatus
                    {
                        Status = "SUCCEED",
                        Message = "Message Has been sent successfully but their is some issue while uploading the attachment. Please try adding attachments later."
                    });

                }


            }
          return Ok(response);
        }

        //This method is used to get ticket converstaion by ticket ID 
        //It will return conversation corresponding to ticket 
        [HttpGet("GetTicketConversationDataById/{ticketId}")]
        public async Task<ActionResult<IEnumerable<TicketViewResponse>>> GetTicketConversationDataById(int ticketId)
        {
            var dbResponse = await _ticketService.GetTicketConversationDataById(ticketId);
            if (dbResponse == null)
            {
                return NotFound();
            }
            return Ok(dbResponse);
        }

        //This method is used to change the status of the ticket by its ID 
        //Only Admin can change the status of the ticket
        [HttpGet("ChangeTicketStatusById/{ticketId}/{userID}/{status}")]
        public async Task<ActionResult<ResponseStatus>> ChangeTicketStatusById(int ticketId,string userId,string status)
        {
            var dbResponse = await _ticketService.ChangeTicketStatusById(ticketId,userId,status);
            if (dbResponse.Status=="FAILED")
            {
                return BadRequest(dbResponse);
            }
            return Ok(dbResponse);
        }

        
    }
}
