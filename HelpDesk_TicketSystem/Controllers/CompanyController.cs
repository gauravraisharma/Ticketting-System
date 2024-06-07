using ApplicationService.IServices;
using ApplicationService.Services;
using DataRepository.EntityModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

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
        [HttpGet("GetCompanyRegisteredApplication/{companyId}")]
        public async Task<IActionResult> GetCompanyRegisteredApplication(int companyId)
        {
            var registeredApplications = await _companyService.GetCompanyRegisteredApplication(companyId);
            return Ok(registeredApplications);
        }

        [HttpPost("RegisterCompanyApplication")]
        public async Task<IActionResult> RegisterCompanyApplication(RegisterCompanyApplicationModel registerCompanyAppModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Please pass the valid Input.");
            }


            var responseStatus = await _companyService.RegisterCompanyApplication(registerCompanyAppModel);

            if (responseStatus.Status == "SUCCEED")
            {
                return Ok(responseStatus);
            }
            else
            {
                return BadRequest(responseStatus.Message);
            }

        }
        [HttpPost("UploadCompanyLogo")]
        public async Task<IActionResult> UploadCompanyLogo([FromForm] CompanyLogoModel companyLogoModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Please pass the valid Input.");
            }


            var responseStatus = await _companyService.UploadCompanyLogo(companyLogoModel);

            if (responseStatus.Status == "SUCCEED")
            {
                return Ok(responseStatus);
            }
            else
            {
                return BadRequest(responseStatus.Message);
            }

        }
        [HttpGet("DeleteApplication/{id}")]
        public async Task<IActionResult> DeleteApplication(int id)
        {
            return Ok(await _companyService.DeleteApplication(id));
        }
    }
}

