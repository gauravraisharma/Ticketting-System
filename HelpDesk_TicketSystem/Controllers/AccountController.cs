using ApplicationService.IServices;
using DataRepository.EntityModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace HelpDesk_TicketSystem.Controllers
{
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = "Bearer")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IAccountService _accountService;

        public AccountController(IAccountService accountService)
        {
            _accountService = accountService;
        }

        //LoginUser method is used to check user credential and allow login into application 
        //It will return the token in response if user is valid
        [AllowAnonymous]
        [HttpPost("LoginUser")]
        public async Task<IActionResult> LoginUser(UserLoginModel userModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Please Login with proper username and password");
            }
            var loginStatus = await _accountService.UserLogin(userModel);

            if (loginStatus.Status == "SUCCEED")
            {
                return Ok(loginStatus);
            }
            else
            {
                return BadRequest(loginStatus.Message);
            }
        }

        //It will create the application user
        //It will only create Normal user not admin
        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpPost("CreateApplicationUser")]
        public async Task<IActionResult> CreateApplicationUser(ApplicationUserModel userModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Please pass the valid Input.");
            }

            
            var responseStatus = await _accountService.CreateApplicationUser(userModel);

            if (responseStatus.Status == "SUCCEED")
            {
                return Ok(responseStatus);
            }
            else
            {
                return BadRequest(responseStatus.Message);
            }

        }


        //It will create the application Role
        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpGet("CreateNewRole/{roleName}")]
        public async Task<IActionResult> CreateNewRole(string roleName)
        {
            if (string.IsNullOrEmpty(roleName))
            {
                return BadRequest("Please pass the valid Input.");
            }

            var responseStatus = await _accountService.CreateNewRole(roleName);

            if (responseStatus.Status == "SUCCEED")
            {
                return Ok(responseStatus.Message);
            }
            else
            {
                return BadRequest(responseStatus.Message);
            }

        }
        //This method is used to get List of department 

        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpGet("GetDepartmentListDD")]
        public  ActionResult GetDepartmentListDD()
        {
            var dbResponse =  _accountService.GetDepartmentListDD();
            if (dbResponse.Status == "FAILED")
            {
                return BadRequest();
            }
            return Ok(dbResponse.DdList);
        }
        //This method is used to get List of Roles 
        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpGet("GetUserTypeListDD")]
        public  ActionResult GetUserTypeListDD()
        {
            var dbResponse =  _accountService.GetUserTypeListDD();
            if (dbResponse.Status == "FAILED")
            {
                return BadRequest();
            }
            return Ok(dbResponse.DdList);
        }

        //This method is used to get List of Roles 
        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpGet("GetUserList")]
        public  ActionResult GetUserList()
        {
            var dbResponse =  _accountService.GetUserList();
           
            return Ok(dbResponse);
        }

    }
}
