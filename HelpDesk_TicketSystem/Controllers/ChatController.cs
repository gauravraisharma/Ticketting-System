using ApplicationService.IServices;
using DataRepository.EntityModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HelpDesk_TicketSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        public readonly IChatService _chatService;
        public ChatController(IChatService chatService)
        {
            _chatService = chatService;
        }

        [HttpPost("RegisterChatUser")]
        public async Task<IActionResult> RegisterChatUser(ChatUserRegister chatUserModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Please valid enter data ");
            }
           var responseStatus= await _chatService.ChatUserRegister(chatUserModel);
            if (responseStatus.Status == "SUCCEED")
            {
                return Ok(responseStatus);
            }
            return BadRequest(responseStatus);

        }
        [HttpGet("GetChatUsers")]
        public async Task<IActionResult> GetChatUsers()
        {
           var chatUsers=await _chatService.GetChatUsers();
            return Ok(chatUsers);

        }
    }
}
