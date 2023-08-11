using ApplicationService.IServices;
using DataRepository.EntityModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.Design;

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

         //It will update the application user
        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpPost("updateApplicationUser")]
        public async Task<IActionResult> UpdateApplicationUser(UpdateApplicationUserModel userModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Please pass the valid Input.");
            }

            
            var responseStatus = await _accountService.UpdateApplicationUser(userModel);

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

        //[Authorize(AuthenticationSchemes = "Bearer")]
        [AllowAnonymous]
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
        [HttpGet("GetUserList/{companyId}")]
        public  ActionResult GetUserList(int companyId)
        {
            var dbResponse =  _accountService.GetUserList(companyId);
           
            return Ok(dbResponse);
        }
        //This method is used to get User data based on the userId passed 
        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpGet("getUserDataById/{userId}")]
        public  ActionResult GetUserDataById(string userId)
        {
            var dbResponse =  _accountService.GetUserDataById(userId);
           
            return Ok(dbResponse);
        }

        //This method is used to get List of department 

        [Authorize(AuthenticationSchemes = "Bearer")]
        [HttpGet("DeleteUser/{userId}")]
        public ActionResult DeleteUser(string userId)
        {
            var dbResponse = _accountService.DeleteUser(userId);
            if (dbResponse.Status == "FAILED")
            {
                return BadRequest();
            }
            return Ok(dbResponse);
        }

        //This method will generate a new token using which superadmin can act as a company admin 
        [Authorize(AuthenticationSchemes = "Bearer", Roles = "SUPERADMIN")]
        [HttpGet("SwitchToCompanyAdmin/{userId}")]
        public async Task<ActionResult> SwitchToCompanyAdmin(string userId)
        {
            var dbResponse = await _accountService.SwitchToCompanyAdmin(userId);
            if (dbResponse.Status == "FAILED")
            {
                return BadRequest();
            }
            return Ok(dbResponse);
        }
        //This method will generate a new token using which superadmin can act as a company admin 
        [Authorize(AuthenticationSchemes = "Bearer", Roles = "SUPERADMIN,ADMIN")]
        [HttpGet("SwitchToSuperadmin/{userId}")]
        public async Task<ActionResult> SwitchToSuperadmin(string userId)
        {
            var dbResponse = await _accountService.SwitchToSuperadmin(userId);
            if (dbResponse.Status == "FAILED")
            {
                return BadRequest();
            }
            return Ok(dbResponse);
        }
    }
}
