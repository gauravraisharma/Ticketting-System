using ApplicationService.IServices;
using ApplicationService.Services;
using DataRepository.EntityModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HelpDesk_TicketSystem.Controllers
{
    [Authorize(AuthenticationSchemes = "Bearer")]
    [Route("api/[controller]")]
    [ApiController]
    public class CompanyController : ControllerBase
    {
        private readonly ICompanyService _companyService;
        public CompanyController(ICompanyService companyService)
        {
                _companyService = companyService;
        }
        //To get all the companies
        [HttpGet("GetCompany")]
        public async Task<IActionResult> GetCompany()
        {
            var company = await _companyService.GetCompany();
            return Ok(company);
        }

        //It will create the application user
        [AllowAnonymous]
        [HttpPost("RegisterCompany")]
        public async Task<IActionResult> RegisterCompany(RegisterCompanyModel registerCompanyModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Please pass the valid Input.");
            }


            var responseStatus = await _companyService.RegisterCompany(registerCompanyModel);

            if (responseStatus.Status == "SUCCEED")
            {
                return Ok(responseStatus);
            }
            else
            {
                return BadRequest(responseStatus.Message);
            }

        }

        [HttpPost("UpdateTimeZone")]
        public async Task<IActionResult> UpdateTimeZone(UpdateTimeZone updateTimeZoneModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Please pass the valid Input.");
            }


            var responseStatus = await _companyService.UpdateTimeZone(updateTimeZoneModel);

            if (responseStatus.Status == "SUCCEED")
            {
                return Ok(responseStatus);
            }
            else
            {
                return BadRequest(responseStatus.Message);
            }

        }
    }
    }

