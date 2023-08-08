using ApplicationService.IServices;
using ApplicationService.Utilities;
using DataRepository.EntityModels;
using DataRepository.IRepository;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationService.Services
{
    public class CompanyService:ICompanyService
    {
        private readonly ICompanyRepository _companyRepository;
        private readonly IConfiguration _config;
        public CompanyService(ICompanyRepository companyRepository,IConfiguration config)
        {
            _companyRepository = companyRepository;
            _config = config;
        }

        public Task<List<GetCompanyResponse>> GetCompany()
        {
           return _companyRepository.GetCompany();
        }

        public async Task<ResponseStatus> RegisterCompany(RegisterCompanyModel registerCompanyModel)
        {
            var response = await _companyRepository.RegisterCompany(registerCompanyModel);
            if (response.Status == "SUCCEED")
                try
                {
                    var emailSubject = _config["CompanyRegisterEmailSubject"];
                    var emailTemplate = _config["CompanyRegisterEmailTemplate"];

                    Dictionary<string, string> messageVariable = new Dictionary<string, string> {
                      { "@@username", registerCompanyModel.UserName },
                      { "@@password", registerCompanyModel.Password },
                    };

                    MailOperations.SendEmailAsync(new List<string> { registerCompanyModel.Email }, emailSubject, emailTemplate, _config, null, messageVariable);
                }
                catch (Exception e)
                {

                }
            return response;
        }

        public Task<ResponseStatus> UpdateTimeZone(UpdateTimeZone updateTimeZoneModel)
        {
           return _companyRepository.UpdateTimeZone(updateTimeZoneModel);
        }
    }
}
