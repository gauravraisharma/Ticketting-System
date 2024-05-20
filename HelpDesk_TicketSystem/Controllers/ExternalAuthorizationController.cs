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
        private readonly ITokenService _tokenService;
        public ExternalAuthorizationController(IExternalAuthorizationService externalAuthorizationService, ITokenService tokenService)
        {
            _externalAuthorizationService = externalAuthorizationService;
            _tokenService = tokenService;
        }

        [HttpPost("ConnectWithClient")]
        public async Task<IActionResult> ConnectWithClient([FromBody] ConnectWithClientRequest clientRequest)
        {

            if (clientRequest == null)
            {
                return BadRequest("Client request is null");
            }
            

            var response = await _externalAuthorizationService.ConnectWithClient(clientRequest);
            return Ok(response);
        }
    }
}
