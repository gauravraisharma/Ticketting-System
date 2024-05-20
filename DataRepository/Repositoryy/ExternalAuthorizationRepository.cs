using DataRepository.EntityModels;
using DataRepository.IRepository;
using DataRepository.Repository;
using DataRepository.Utils;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataRepository.Repositoryy
{
    public class ExternalAuthorizationRepository : IExternalAuthorizationRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _config;
        private readonly IAccountRepository _accountRepository;


        public ExternalAuthorizationRepository(ApplicationDbContext context, UserManager<ApplicationUser> userManager, IConfiguration config, IAccountRepository accountRepository)
        {
            _context = context;
            _userManager = userManager;
            _config = config;
            _accountRepository = accountRepository;
        }

        public async  Task<ConnectWithClientResponse> ConnectWithClient(ConnectWithClientBLLModel clientRequest)
        {
            var applicationDetails = await _context.CompanyRegisteredApplications.FirstOrDefaultAsync(application => application.ApplicationName == clientRequest.ApplicationName);
            if (applicationDetails == null)
            {
                return new ConnectWithClientResponse
                {
                    Status = "FAILED",
                    Message = "Application not found"
                };
            }
            return new ConnectWithClientResponse
            {
                ClientSecretKey = applicationDetails.ClientSecretKey,
                ApplicationURL = applicationDetails.ApplicationURL,
                DomainURL = applicationDetails.DomainURL,
                Status = "SUCCEED",
                Message = "Fetched application details"
            };
        }

        public  async Task<ApplicationUser> IsUserFound(string userEmail, string userName)
        {
            var userFound = await _userManager.FindByEmailAsync(userEmail);
            var userNameFound = await _userManager.FindByNameAsync(userName);
            if(userFound == null || userNameFound == null)
            { 
                return null;
            }
            return userFound;
        }
        public async Task<string> GetRoleId(string roleName)
        {
            try
            {
                if (_context == null)
                {
                    return "Role not found";
                }
                var result = (from role in _context.Roles
                              where role.Name == roleName
                              select new
                              {
                                  Id = role.Id
                              }
                              );

                return result.FirstOrDefault().Id;
             

            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
        public async Task<LoginStatus> AuthenticateExternalUser(string email, string refreshToken, string applicationName)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return new LoginStatus
                {
                    Status = "FAILED",
                    Message = "User doesn't exist"
                };
            }
            await _userManager.SetAuthenticationTokenAsync(user, applicationName, "Refresh Token", refreshToken);
            var gettoken = _userManager.GetAuthenticationTokenAsync(user, applicationName, "Refresh Token");

            var userRoles = await _userManager.GetRolesAsync(user);
            var token = Helper.GenerateToken(user, false, _config["Jwt:Key"], userRoles.FirstOrDefault().ToUpper());

            var CompanyTimeZone = (from Company in _context.Companys
                                   where Company.Id == user.CompanyId
                                   select new
                                   {
                                       TimeZone = Company.TimeZone
                                   }
                                  ).FirstOrDefault();
            return new LoginStatus
            {
                Status = "SUCCEED",
                Message = "Login Successfully",
                Token = token,
                UserType = userRoles[0],
                UserId = user.Id,
                CompanyId = user.CompanyId,
                TimeZone = (userRoles[0].ToUpper() == "SUPERADMIN") ? null : CompanyTimeZone.TimeZone
            };
        }


        public async Task<LoginStatus> RegisterExternalUser(CipherUserDataModel cipherUserDataModel, string refreshToken, string applicationName)
        {
            var userType = await GetRoleId(cipherUserDataModel.UserType.ToString());
            var companyId =  (from companyApplication in _context.CompanyRegisteredApplications  where companyApplication.ApplicationName == applicationName
                              select companyApplication.CompanyId
                                  ).FirstOrDefault();


            ApplicationUserModel userModel = new ApplicationUserModel()
            {
                Email = cipherUserDataModel.Email,
                FirstName = cipherUserDataModel.FirstName,
                LastName = cipherUserDataModel.LastName,
                PhoneNumber = cipherUserDataModel.MobilePhne,
                UserName = cipherUserDataModel.UserName,
                CreatedBy = Guid.Empty.ToString(),
                UserType = userType,
                Password = "!Random1234password#",
                CompanyId = companyId
            };
            var userResponse = await _accountRepository.CreateApplicationUser(userModel);
            if (userResponse.Status == "SUCCEED")
            {
                var loginResponse = await AuthenticateExternalUser(userModel.Email, refreshToken, applicationName);
                return loginResponse;

            }
            return new LoginStatus { Status = "FAILED", Message = "Failed to register user." };

        }
    }
        
    
}
    