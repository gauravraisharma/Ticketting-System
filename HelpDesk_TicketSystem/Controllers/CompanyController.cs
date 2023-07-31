﻿using ApplicationService.IServices;
using ApplicationService.Services;
using DataRepository.EntityModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HelpDesk_TicketSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompanyController : ControllerBase
    {
        private readonly ICompanyService _companyService;
        public CompanyController(ICompanyService companyService)
        {
                _companyService = companyService;
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

    }
}