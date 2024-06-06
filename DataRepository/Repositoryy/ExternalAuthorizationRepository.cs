using Azure.Core;
using DataRepository.Constants;
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
                APIEndpoint = applicationDetails.APIEndpoint,
                Status = "SUCCEED",
                Message = "Fetched application details"
            };
        }

        public  async Task<ApplicationUser> IsUserFound(string userEmail)
        {
            var userFound = await _userManager.FindByEmailAsync(userEmail);
            if(userFound == null)
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
        public async Task<ExternalLoginStatus> AuthenticateExternalUser(string email, string applicationName)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return new ExternalLoginStatus
                {
                    Status = "FAILED",
                    Message = "User doesn't exist"
                };
            }
            var accessToken = await _userManager.GetAuthenticationTokenAsync(user, applicationName, "External Access Token");
            var refreshToken = await _userManager.GetAuthenticationTokenAsync(user, applicationName, "External Refresh Token");


            var userRoles = await _userManager.GetRolesAsync(user);
            var token = Helper.GenerateToken(user, false, _config["Jwt:Key"], userRoles.FirstOrDefault().ToUpper());

            var CompanyTimeZone = (from Company in _context.Companys
                                   where Company.Id == user.CompanyId
                                   select new
                                   {
                                       TimeZone = Company.TimeZone
                                   }
                                  ).FirstOrDefault();
            var CompanyLogo = (from Company in _context.Companys
                               where Company.Id == user.CompanyId
                               select new
                               {
                                   companyLogo = Company.CompanyLogo
                               }
                                   ).FirstOrDefault();
            var CompanyName = (from Company in _context.Companys
                               where Company.Id == user.CompanyId
                               select new
                               {
                                   companyName = Company.Name
                               }
                                  ).FirstOrDefault();
            return new ExternalLoginStatus
            {
                Status = "SUCCEED",
                Message = "Login Successfully",
                Token = token,
                UserType = userRoles[0],
                UserId = user.Id,
                CompanyId = user.CompanyId,
                TimeZone = (userRoles[0].ToUpper() == "SUPERADMIN") ? null : CompanyTimeZone.TimeZone,
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                CompanyLogo = CompanyLogo.companyLogo == "" ? null : AttachmentHelper.GetAssetLink(_config["AssetLink"], "\\" + ImageFolderConstants.CompanyLogo + "\\", CompanyLogo.companyLogo),
                Name = user.FirstName + " " + user.LastName,
                CompanyName = CompanyName.companyName

            };
        }


        public async Task<ExternalLoginStatus> RegisterExternalUser(CipherUserDataModel cipherUserDataModel, string userIdentityToken, string refreshToken, string applicationName)
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
                var tokenres = await SaveExternalTokens(userModel.Email, applicationName, userIdentityToken, refreshToken);

                var loginResponse = await AuthenticateExternalUser(userModel.Email, applicationName);
                return loginResponse;

            }
            return new ExternalLoginStatus { Status = "FAILED", Message = "Failed to register user." };

        }

        public async Task<ResponseStatus> SaveExternalTokens(string email, string applicationName, string userIdentityToken, string refreshToken)
        {
            try
            {
                var user = await _userManager.FindByEmailAsync(email);

                await _userManager.SetAuthenticationTokenAsync(user, applicationName, "External User Identity Token", userIdentityToken);
                await _userManager.SetAuthenticationTokenAsync(user, applicationName, "External Refresh Token", refreshToken);
                return new ResponseStatus()
                {
                    Status = "SUCCEED",
                    Message = "Successfully Saved tokens"
                };
            }
            catch
            {
                return new ResponseStatus()
                {
                    Status = "FAILED",
                    Message = "Failed to save tokens"
                };
            }
        }
    }
        
    
}
    