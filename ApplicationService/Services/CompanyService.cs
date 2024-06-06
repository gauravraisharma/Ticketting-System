using ApplicationService.IServices;
using ApplicationService.Utilities;
using DataRepository.Constants;
using DataRepository.EntityModels;
using DataRepository.IRepository;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting.Internal;
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
        private readonly IWebHostEnvironment _hostingEnvironment;
        public CompanyService(ICompanyRepository companyRepository,IConfiguration config, IWebHostEnvironment hostingEnvironment)
        {
            _companyRepository = companyRepository;
            _config = config;
            _hostingEnvironment = hostingEnvironment;
        }

        public Task<List<GetCompanyResponse>> GetCompany()
        {
           return _companyRepository.GetCompany();
        }

        public Task<List<GetCompanyRegisteredApplicationResponse>> GetCompanyRegisteredApplication(int companyId)
        {
            return _companyRepository.GetCompanyRegisteredApplication(companyId);
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

        public Task<RegisterCompanyApplicationResponse> RegisterCompanyApplication(RegisterCompanyApplicationModel registerCompanyAppModel)
        {
            var clientSecretKey = ClientKeyOperation.GenerateSecretKey();
            RegisterCompanyApplicationBLLModel model = new RegisterCompanyApplicationBLLModel()
            {
                ApplicationName = registerCompanyAppModel.ApplicationName,
                ApplicationURL = registerCompanyAppModel.ApplicationURL,
                APIEndpoint = registerCompanyAppModel.APIEndpoint,
                ClientSecretKey = clientSecretKey,
                CompanyId = registerCompanyAppModel.CompanyId
            };
            var response =  _companyRepository.RegisterCompanyApplication(model);
            return response;

        }

        public Task<ResponseStatus> UpdateTimeZone(UpdateTimeZone updateTimeZoneModel)
        {
           return _companyRepository.UpdateTimeZone(updateTimeZoneModel);
        }

        public async Task<CompanyLogoResponseStatus> UploadCompanyLogo(CompanyLogoModel companyLogoModel)
        {
            List<FileUploadResponse> attachmentsResponse = FileOperation.UploadFile(companyLogoModel.CompanyLogo, _hostingEnvironment, _config, ImageFolderConstants.CompanyLogo);
            if (attachmentsResponse != null)
            {
                CompanyLogoBLLModel model = new CompanyLogoBLLModel
                {
                    CompanyId = int.Parse(companyLogoModel.CompanyId),
                    CompanyLogoDetails = attachmentsResponse,
                };
                CompanyLogoResponseStatus attachmentResponse = await _companyRepository.UploadCompanyLogo(model);
                return attachmentResponse;
            }
            return new CompanyLogoResponseStatus
            {
                Status = "FAILED",
                Message = "Something went wrong while uploading the attachment.",
            };

        }
        public async Task<ResponseStatus> DeleteApplication(int id)
        {
            return await _companyRepository.DeleteApplication(id);
        }
    }
}
