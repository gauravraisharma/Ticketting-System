using ApplicationService.Constants;
using ApplicationService.IServices;
using DataRepository.EntityModels;
using DataRepository.Enums;
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
            if (response.Status == ResponseCode.Unauthorized || response.Status == ResponseCode.RequestTimeout || response.Status == ResponseCode.Forbidden || response.Status == ResponseCode.NotFound || response.Status == ResponseCode.BadRequest)
            {
                // Set up the response to redirect
                Response.StatusCode = StatusCodes.Status302Found;
                Response.Headers["Location"] = "pageNotAuthorized";
                return new EmptyResult();
            }
            else if(response.Status == ResponseCode.InternalServerError)
            {
                Response.StatusCode = StatusCodes.Status302Found;
                Response.Headers["Location"] = "internalError";
                return new EmptyResult();
            }
            return Ok(response);
        }

        [HttpPost("ValidateToken")]
        public async Task<IActionResult> ValidateToken([FromBody] ValidateTokenRequest validateTokenRequest)
        {

            if (validateTokenRequest == null)
            {
                return BadRequest("Validate token request is null");
            }


            var response = await _externalAuthorizationService.ValidateToken(validateTokenRequest);
            return Ok(response);
        }

    }
}
