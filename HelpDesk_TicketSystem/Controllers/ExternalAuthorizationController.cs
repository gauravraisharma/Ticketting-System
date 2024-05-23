using ApplicationService.Constants;
using ApplicationService.IServices;
using DataRepository.EntityModels;
using Jose;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace HelpDesk_TicketSystem.Controllers
{
    [Route("api/[controller]")]
    public class ExternalAuthorizationController : Controller
    {
        private readonly IExternalAuthorizationService _externalAuthorizationService;
        public ExternalAuthorizationController(IExternalAuthorizationService externalAuthorizationService)
        {
            _externalAuthorizationService = externalAuthorizationService;
        }

        [HttpPost("ConnectWithClient")]
        public async Task<IActionResult> ConnectWithClient([FromBody] ConnectWithClientRequest clientRequest)
        {

            if (clientRequest == null)
            {
                return BadRequest("Client request is null");
            }
            

            var response = await _externalAuthorizationService.ConnectWithClient(clientRequest);
            if (response.Status == "REDIRECT")
            {
                 // Set up the response to redirect
                 Response.StatusCode = StatusCodes.Status302Found;
                 Response.Headers["Location"] = response.Message;
                 return new EmptyResult(); 
            }
            return Ok(response);
            }
        
    }
}
