using ApplicationService.IServices;
using ApplicationService.Services;
using DataRepository.EntityModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;

namespace HelpDesk_TicketSystem.Controllers
{
  //  [Authorize(AuthenticationSchemes = "Bearer")]
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dasboardService;
        public DashboardController(IDashboardService dashboardService)
        {
            _dasboardService = dashboardService;
        }

        [Authorize(AuthenticationSchemes = "Bearer",Roles = "SUPERADMIN")]
        //To get all the companies count 
        [HttpGet("GetCompanyCount")]
        public async Task<IActionResult> GetCompanyCount()
        {
            var company =  _dasboardService.GetCompanyCount();
            return Ok(company);
        }

        //This method is used to get ticket total number of ticket created by user
        //For admin type user total ticket count will be return 
        [HttpGet("GetUserAndTicketCount/{userId}/{companyId}")]
        public async Task<ActionResult<DashboardResponseStatus>> GetUserAndTicketCount(string userId, int companyId)
        {
            var dbResponse = await _dasboardService.GetUserAndTicketCount(userId, companyId);
            if (dbResponse.Status == "FAILED")
            {
                return BadRequest(dbResponse);
            }
            return Ok(dbResponse);
        }

        [HttpGet("GetAllTicketsWithPriority/{userId}/{userType}/{companyId}")]
        public async Task<ActionResult<PrioritChartResponse>> GetAllTicketsWithPriority(string userId, string userType, int companyId)
        {
           var response=await _dasboardService.GetAllTicketsWithPriority(userId, userType,companyId);
            return Ok(response);
        }
        [HttpGet("GetAllTicketCreated/{userId}/{companyId}/{startDate}/{endDate}")]
        public async Task<ActionResult<LinechartData>> GetAllTicketCreated(string startDate ,string endDate,string userId,int companyId)
        {
            var response=await _dasboardService.GetAllTicketCreated(startDate, endDate, userId, companyId);
            return Ok(response);
        }
        
        [HttpGet("GetChartDataByDepartment/{userId}/{userType}/{companyId}")]
        public ActionResult<ChartResponse> GetChartDataByDepartment(string userId, string userType, int companyId)
        {
            var dbResponse =  _dasboardService.GetChartDataByDepartment(userId, userType,companyId);
            if (dbResponse.Status == "FAILED")
            {
                return BadRequest(dbResponse);
            }
            return Ok(dbResponse);
        }
    }
}
