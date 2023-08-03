using ApplicationService.IServices;
using ApplicationService.Utilities;
using Azure;
using DataRepository.EntityModels;
using DataRepository.IRepository;
using Microsoft.Extensions.Configuration;

namespace ApplicationService.Services
{
    public class AccountService : IAccountService
    {
        private readonly IAccountRepository _accountRepository;
        private readonly IConfiguration _config;

        public AccountService(IAccountRepository accountRepository, IConfiguration config)
        {
            _accountRepository = accountRepository;
            _config = config;
        }

        public async Task<ResponseStatus> CreateApplicationUser(ApplicationUserModel userModel)
        {
            var response = await _accountRepository.CreateApplicationUser(userModel);
           if(response.Status == "SUCCEED")
            try
            {
                var emailSubject = _config["NewUserRegisterEmailSubject"];
                var emailTemplate = _config["NewUserRegisterEmailTemplate"];
             
                Dictionary<string, string> messageVariable = new Dictionary<string, string> {
                      { "@@username", userModel.UserName },
                      { "@@password", userModel.Password },
                    };

                MailOperations.SendEmailAsync(new List<string> { userModel.Email } , emailSubject, emailTemplate, _config, null, messageVariable);
            }
            catch (Exception e)
            {

            }
            return response;
        }
          public Task<ResponseStatus> UpdateApplicationUser(UpdateApplicationUserModel userModel)
        {
            return _accountRepository.UpdateApplicationUser(userModel);  
        }

        public Task<ResponseStatus> CreateNewRole(string roleName)
        {
           return _accountRepository.CreateNewRole(roleName);
        }

        public DDListResponse GetDepartmentListDD()
        {
            return _accountRepository.GetDepartmentListDD();
        }

        public ResponseStatus GetRoleName(string roleId)
        {
            return _accountRepository.GetRoleName(roleId);
        }

        public IEnumerable<ResponseApplicationUserModel> GetUserList(int companyId)
        {
            return _accountRepository.GetUserList(companyId);
        }

        public DDListResponse GetUserTypeListDD()
        {
            return _accountRepository.GetUserTypeListDD();
        }

        public Task<LoginStatus> UserLogin(UserLoginModel userModel)
        {
            return _accountRepository.UserLogin(userModel);
        }
        public ResponseStatus DeleteUser(string userId)
        {
            return _accountRepository.DeleteUser(userId);
        }
        
        public UserDataResponse GetUserDataById(string userId)
        {
            return _accountRepository.GetUserDataById(userId);
        }
        
        public Task<ResponseStatus> SwitchToCompanyAdmin(string userId)
        {
            return _accountRepository.SwitchToCompanyAdmin(userId);
        }
        public Task<ResponseStatus> SwitchToSuperadmin(string userId)
        {
            return _accountRepository.SwitchToSuperadmin(userId);
        }
    }
}
